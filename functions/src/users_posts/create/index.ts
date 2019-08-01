import { ts } from '@daviswhitehead/shayr-resources';
import { firebase } from '../../lib/Config';
import { logger } from '../../lib/Utility';

export const onCreateUsersPosts = (db: any, snap: any, context: any) => {
  return db
    .collection('users_posts')
    .doc(context.params.usersPostsId)
    .set(
      {
        createdAt: ts(firebase.firestore)
      },
      { merge: true }
    )
    .then((response: any) => {
      console.log('Success:');
      logger(response);
    })
    .catch((error: Error) => {
      console.log('Error:');
      logger(error);
    });
};
