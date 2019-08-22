import { getChangeInfo, logger } from '../lib/Utility';
import { onCreateNotification as onCreateNotificationV1 } from './create/v1';
import { onWriteNotification as onWriteNotificationV1 } from './write/v1';

export const _onWriteNotification = async (
  db: any,
  change: any,
  context: any
) => {
  console.log('change');
  logger(change);

  const changeInfo = getChangeInfo(change);
  console.log('changeInfo');
  logger(changeInfo);

  // get app version and trigger the right cloud function based on that app version

  if (changeInfo.isNewDocument) {
    // create functions
    return onCreateNotificationV1(db, changeInfo, context);
  }
  // write functions
  // update unreadNotificationsCount for user
  await onWriteNotificationV1(db, changeInfo, context);
  return;
};
