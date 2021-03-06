import {
  getDocument,
  Batcher,
  Message,
  Notification,
  notificationDefault,
  ts
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';
import { logger } from '../../../lib/Utility';
import { composeNotification } from '../../../notifications/lib/Compose';
import { newShareNotificationCopy } from '../../../notifications/lib/Copy';
import { postDetails } from '../../../notifications/lib/AppLinks';
import { firebase } from '../../../lib/Config';

// onWriteSharesNew({before: {postId: '', createdAt: '', mentionId: '', commentId: '', updatedAt: '', url: 'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147', status: 'started', payload: 'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147', userId: 'm592UXpes3azls6LnhN2VOf2PyT2', }, after: {postId: '48PKLyY71DHin1XuIPop', createdAt: '', mentionId: 'aQUrpfw4ZZVqFsLuiIh2', commentId: 'SGsXouMTkGjgnQ6A4pH6', updatedAt: '', url: 'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147', status: 'confirmed', payload: 'https://onezero.medium.com/how-crypto-could-bring-tax-evasion-to-the-masses-bb4060766147', userId: 'm592UXpes3azls6LnhN2VOf2PyT2', }}, {params: {shareId: 'cPjRBZAhYe4EvJfHY0sZ', }})
export const _onUpdateShare = async (
  db: any,
  changeInfo: any,
  context: any
) => {
  const batcher = new Batcher(db);

  console.log('changeInfo');
  logger(changeInfo);

  // prevent function from running if mentionId hasn't been attached yet
  if (
    _.isEmpty(changeInfo.after.mentionId) ||
    changeInfo.after.mentionId === changeInfo.before.mentionId
  ) {
    return;
  }

  const user = await getDocument(db, `users/${changeInfo.after.userId}`);
  console.log('user');
  logger(user);

  const post = await getDocument(db, `posts/${changeInfo.after.postId}`);
  console.log('post');
  logger(post);

  const mention = await getDocument(
    db,
    `mentions/${changeInfo.after.mentionId}`
  );
  console.log('mention');
  logger(mention);

  const notificationCopy = newShareNotificationCopy(user, post);
  console.log('notificationCopy');
  logger(notificationCopy);

  const notificationAppLink = postDetails(user, post);
  console.log('notificationAppLink');
  logger(notificationAppLink);

  if (mention || !_.isEmpty(mention.users)) {
    await Promise.all(
      mention.users.map(async (mentionUserId: string) => {
        const mentionUser = await getDocument(db, `users/${mentionUserId}`);
        console.log('mentionUser');
        logger(mentionUser);

        if (mentionUser.pushToken) {
          const message: Message = composeNotification(
            mentionUser.pushToken,
            notificationCopy,
            notificationAppLink,
            'General',
            'high',
            mentionUser.unreadNotificationsCount
              ? mentionUser.unreadNotificationsCount + 1
              : 1
          );
          console.log('message');
          logger(message);

          const notification: Notification = {
            ...notificationDefault,
            createdAt: ts(firebase.firestore),
            fromId: user._id,
            message,
            receivingUserId: mentionUserId,
            updatedAt: ts(firebase.firestore)
          };
          console.log('notification');
          logger(notification);

          batcher.set(db.collection('notifications').doc(), notification);
        } else {
          console.log(`${mentionUserId} does not have a pushToken`);
        }
      })
    );
  }

  const errors = batcher.write();
  if (_.isEmpty(errors)) {
    console.log('success!');
  } else {
    console.error('failure :/');
  }

  return true;
};
