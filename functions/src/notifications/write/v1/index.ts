import { logger } from '../../../lib/Utility';
import {
  Batcher,
  getDocumentsInCollection
} from '@daviswhitehead/shayr-resources';
import _ from 'lodash';

export const onWriteNotification = async (
  db: any,
  changeInfo: any,
  context: any
) => {
  try {
    const batcher = new Batcher(db);

    // get receivingUserId
    const receivingUserId = changeInfo.after.receivingUserId;
    console.log('receivingUserId');
    logger(receivingUserId);

    // get count of all unread notifications for receivingUserId
    const unreadNotifications = await getDocumentsInCollection(
      db
        .collection('notifications')
        .where('receivingUserId', '==', receivingUserId)
        .where('isRead', '==', false)
    );
    console.log('unreadNotifications');
    logger(unreadNotifications);

    const unreadNotificationsCount = unreadNotifications
      ? _.size(unreadNotifications.documents)
      : 0;
    console.log('unreadNotificationsCount');
    logger(unreadNotificationsCount);

    // update receivingUserId User object with unread count
    batcher.set(
      db.collection('users').doc(receivingUserId),
      {
        unreadNotificationsCount
      },
      { merge: true }
    );
    const errors = await batcher.write();
    console.log('errors');
    logger(errors);
  } catch (error) {
    console.error(error);
  }
};
