import { onCreateNotification as onCreateNotificationv1 } from './create/v1';

export const _onCreateNotification = (snap: any, context: any) => {
  return onCreateNotificationv1(snap, context);
};
