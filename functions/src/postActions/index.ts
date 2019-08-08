import {
  getDocument,
  Batcher,
  Message,
  Notification,
  notificationDefault
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import { logger, ts } from '../lib/Utility';
import { composeNotification } from '../notifications/lib/Compose';
import {
  newDoneNotificationCopy,
  newLikeNotificationCopy
} from '../notifications/lib/Copy';
import { postDetails } from '../notifications/lib/AppLinks';

export const onCreatePostAction = async (db: any, snap: any, context: any) => {
  const batcher = new Batcher(db);

  const isDone = _.includes(snap.ref.path, 'dones');
  const snapData = snap.data();
  logger('snapData');
  logger(snapData);

  const user = await getDocument(db, `users/${snapData.userId}`);
  logger('user');
  logger(user);

  const post = await getDocument(db, `posts/${snapData.postId}`);
  logger('post');
  logger(post);

  const usersPost = await getDocument(
    db,
    `users_posts/${snapData.userId}_${snapData.postId}`
  );
  logger('usersPost');
  logger(usersPost);

  const notificationCopy = isDone
    ? newDoneNotificationCopy(user, post)
    : newLikeNotificationCopy(user, post);
  logger('notificationCopy');
  logger(notificationCopy);

  const notificationAppLink = postDetails(user, post);
  logger('notificationAppLink');
  logger(notificationAppLink);

  if (!_.isEmpty(usersPost.shares)) {
    await Promise.all(
      usersPost.shares.map(async (shareUserId: string) => {
        if (shareUserId === snapData.userId) {
          logger('preventing sending notification to same user');
          return;
        }
        const shareUser = await getDocument(db, `users/${shareUserId}`);
        logger('shareUser');
        logger(shareUser);

        if (shareUser.pushToken) {
          const message: Message = composeNotification(
            shareUser.pushToken,
            notificationCopy,
            notificationAppLink,
            'General',
            'high',
            1
          );
          logger('message');
          logger(message);

          const notification: Notification = {
            ...notificationDefault,
            createdAt: ts,
            fromId: user._id,
            message,
            receivingUserId: shareUserId,
            updatedAt: ts
          };
          logger('notification');
          logger(notification);

          batcher.set(db.collection('notifications').doc(), notification);
        } else {
          logger(`${shareUserId} does not have a pushToken`);
        }
      })
    );
  }

  const errors = batcher.write();
  if (_.isEmpty(errors)) {
    logger('success!');
  } else {
    logger('failure :/');
    console.log(errors);
  }

  return true;
};
