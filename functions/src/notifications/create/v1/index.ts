import { msg } from '../../../lib/Config';

export const onCreateNotification = (snap: any, context: any) => {
  const snapData = snap.data();

  return msg
    .send(snapData.message)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};
