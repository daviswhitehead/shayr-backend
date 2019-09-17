import _ from 'lodash';
import {
  getDocument,
  Batcher,
  Message,
  Notification,
  notificationDefault,
  ts
} from '@daviswhitehead/shayr-resources';
import { logger } from '../../../lib/Utility';
import { composeNotification } from '../../../notifications/lib/Compose';
import { newFriendRequestNotificationCopy } from '../../../notifications/lib/Copy';
import { myList } from '../../../notifications/lib/AppLinks';
import { firebase } from '../../../lib/Config';

export const onCreateFriendship = async (
  db: any,
  changeInfo: any,
  context: any
) => {
  console.log('onCreateFriendship');

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

  const notificationCopy = newFriendRequestNotificationCopy(initiatingUser);
  console.log('notificationCopy');
  logger(notificationCopy);

  const notificationAppLink = myList(initiatingUser);
  console.log('notificationAppLink');
  logger(notificationAppLink);

  if (receivingUser.pushToken) {
    const message: Message = composeNotification(
      receivingUser.pushToken,
      notificationCopy,
      notificationAppLink,
      'General',
      'high',
      receivingUser.unreadNotificationsCount
        ? receivingUser.unreadNotificationsCount + 1
        : 1
    );
    console.log('message');
    logger(message);

    const notification: Notification = {
      ...notificationDefault,
      createdAt: ts(firebase.firestore),
      fromId: initiatingUser._id,
      message,
      receivingUserId: receivingUser._id,
      updatedAt: ts(firebase.firestore)
    };
    console.log('notification');
    logger(notification);

    batcher.set(db.collection('notifications').doc(), notification);
  } else {
    console.log(`${receivingUser._id} does not have a pushToken`);
  }

  const errors = batcher.write();
  if (_.isEmpty(errors)) {
    console.log('success!');
  } else {
    console.log('failure :/');
  }

  return true;
};
