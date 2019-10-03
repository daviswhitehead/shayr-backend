import {
  getDocument,
  Batcher,
  Message,
  Notification,
  notificationDefault,
  getDocumentsInCollection,
  ts,
  arrayUnion,
  documentId
} from '@daviswhitehead/shayr-resources';
import { firebase } from '../../../lib/Config';
import _ from 'lodash';
import { logger } from '../../../lib/Utility';
import { composeNotification } from '../../../notifications/lib/Compose';
import { acceptedFriendRequestNotificationCopy } from '../../../notifications/lib/Copy';
import { myList } from '../../../notifications/lib/AppLinks';
import { createPostAtom } from '../../../lib/Atoms';

type Action = 'shares' | 'adds' | 'dones' | 'comments';

const getActionsForBackfill = async (
  db: any,
  batcher: Batcher,
  backfill: any,
  userAId: documentId,
  userBId: documentId,
  action: Action
) => {
  console.log(
    `backfilling posts for user: ${userBId} from user: ${userAId} for action: ${action}`
  );

  const actionResults = await getDocumentsInCollection(
    db
      .collection(action)
      .where('userId', '==', userAId)
      .where('active', '==', true)
  );

  if (actionResults && !_.isEmpty(actionResults.documents)) {
    await Promise.all(
      _.map(actionResults.documents, value => {
        const postId = value.postId;

        if (!postId) {
          return;
        }

        backfill[postId] = {
          ...backfill[postId],
          _reference: db.collection('users_posts').doc(`${userBId}_${postId}`),
          [`${action}`]: arrayUnion(firebase.firestore, userAId),
          postId,
          updatedAt: ts(firebase.firestore),
          userId: userBId
        };

        if (action === 'comments') {
          batcher.set(
            db.doc(`comments/${value._id}`),
            {
              visibleToUserIds: arrayUnion(firebase.firestore, userBId),
              updatedAt: ts(firebase.firestore)
            },
            {
              merge: true
            }
          );
        }
      })
    );
  }
};

const backfillPost = async (db: any, batcher: Batcher, postInfo: any) => {
  const post = await getDocument(db, `posts/${postInfo.postId}`);
  const postAtom = createPostAtom(post);

  if (postInfo.postId === 'SHAYR_HOW_TO') {
    return;
  }

  batcher.set(
    postInfo._reference,
    {
      ...postAtom,
      ..._.omit(postInfo, '_reference')
    },
    {
      merge: true
    }
  );
};

const runBackfill = async (
  db: any,
  batcher: Batcher,
  userAId: documentId,
  userBId: documentId
) => {
  const backfill = {};
  await getActionsForBackfill(
    db,
    batcher,
    backfill,
    userAId,
    userBId,
    'shares'
  );
  await getActionsForBackfill(db, batcher, backfill, userAId, userBId, 'adds');
  await getActionsForBackfill(db, batcher, backfill, userAId, userBId, 'dones');
  await getActionsForBackfill(
    db,
    batcher,
    backfill,
    userAId,
    userBId,
    'comments'
  );

  await Promise.all(
    _.map(backfill, async post => {
      await backfillPost(db, batcher, post);
    })
  );
};

// onWriteSharesNew({before: {postId: '', createdAt: '', mentionId: '', commentId: '', updatedAt: '', url: 'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147', status: 'started', payload: 'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147', userId: 'm592UXpes3azls6LnhN2VOf2PyT2', }, after: {postId: '48PKLyY71DHin1XuIPop', createdAt: '', mentionId: 'aQUrpfw4ZZVqFsLuiIh2', commentId: 'SGsXouMTkGjgnQ6A4pH6', updatedAt: '', url: 'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147', status: 'confirmed', payload: 'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147', userId: 'm592UXpes3azls6LnhN2VOf2PyT2', }}, {params: {shareId: 'cPjRBZAhYe4EvJfHY0sZ', }})
export const onUpdateFriendship = async (
  db: any,
  changeInfo: any,
  context: any
) => {
  console.log('onUpdateFriendship');

  if (changeInfo.after.status !== 'accepted') {
    return;
  }

  const batcher = new Batcher(db);

  const receivingUser = await getDocument(
    db,
    `users/${changeInfo.after.receivingUserId}`
  );
  console.log('receivingUser');
  logger(receivingUser);

  const initiatingUser = await getDocument(
    db,
    `users/${changeInfo.after.initiatingUserId}`
  );
  console.log('initiatingUser');
  logger(initiatingUser);

  // backfilling timelines for each user
  await runBackfill(db, batcher, initiatingUser._id, receivingUser._id);
  await runBackfill(db, batcher, receivingUser._id, initiatingUser._id);

  // create notification
  const notificationCopy = acceptedFriendRequestNotificationCopy(receivingUser);
  console.log('notificationCopy');
  logger(notificationCopy);

  const notificationAppLink = myList(receivingUser);
  console.log('notificationAppLink');
  logger(notificationAppLink);

  if (initiatingUser.pushToken) {
    const message: Message = composeNotification(
      initiatingUser.pushToken,
      notificationCopy,
      notificationAppLink,
      'General',
      'high',
      initiatingUser.unreadNotificationsCount
        ? initiatingUser.unreadNotificationsCount + 1
        : 1
    );
    console.log('message');
    logger(message);

    const notification: Notification = {
      ...notificationDefault,
      createdAt: ts(firebase.firestore),
      fromId: receivingUser._id,
      message,
      receivingUserId: initiatingUser._id,
      updatedAt: ts(firebase.firestore)
    };
    console.log('notification');
    logger(notification);

    batcher.set(db.collection('notifications').doc(), notification);
  } else {
    console.log(`${receivingUser._id} does not have a pushToken`);
  }

  const errors = await batcher.write();
  if (_.isEmpty(errors)) {
    console.log('success!');
  } else {
    console.error('failure :/');
  }

  return;
};
