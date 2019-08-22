import { msg } from '../../../lib/Config';
import { logger } from '../../../lib/Utility';
import _ from 'lodash';

export const onCreateNotification = (
  db: any,
  changeInfo: any,
  context: any
) => {
  console.log('changeInfo.after.message');
  logger(changeInfo.after.message);

  return msg
    .send(changeInfo.after.message)
    .then(response => {
      console.log('Successfully sent message:', response);
    })
    .catch(error => {
      console.log('Error sending message:', error);
    });
};
