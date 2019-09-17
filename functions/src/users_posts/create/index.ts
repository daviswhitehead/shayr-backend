import { ts } from '@daviswhitehead/shayr-resources';
import { firebase } from '../../lib/Config';
import { logger } from '../../lib/Utility';

export const onCreateUsersPosts = async (db: any, snap: any, context: any) => {
  console.log('onCreateUsersPosts');

  const data = snap.data();
  console.log('data');
  logger(data);

  if (data && !data.createdAt) {
    await db
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
  }

  return;
};
