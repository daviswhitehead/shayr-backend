import * as functions from 'firebase-functions';
import { firebase, db } from './lib/Config';
import { _onCreateInboundShare } from './shares/create/InboundShare';
import { _onCreateShare } from './shares/create/v2';
import { onCreatePostAction } from './postActions/index';
import { _onWritePost } from './posts/Post';
import { _onWriteShare } from './shares';
import { _onWriteFriendship } from './friendships';
import { _onWriteNotification } from './notifications/index';
import { onCreateUsersPosts } from './users_posts/create/index';

exports.onCreateDone = functions.firestore
  .document('dones/{doneId}')
  .onCreate((snap, context) => onCreatePostAction(db, snap, context));

exports.onCreateLike = functions.firestore
  .document('likes/{likeId}')
  .onCreate((snap, context) => onCreatePostAction(db, snap, context));

exports.onCreateComment = functions.firestore
  .document('comments/{commentId}')
  .onCreate((snap, context) => onCreatePostAction(db, snap, context));

exports.onWriteNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onWrite((change, context) => _onWriteNotification(db, change, context));

exports.onWritePost = functions.firestore
  .document('posts/{postId}')
  .onWrite((change, context) => _onWritePost(db, change, context));

exports.onWriteShare = functions.firestore
  .document('shares/{shareId}')
  .onWrite((change, context) => _onWriteShare(db, change, context));

exports.onWriteFriendship = functions.firestore
  .document('friendships/{friendshipId}')
  .onWrite((change, context) => _onWriteFriendship(db, change, context));

exports.onCreateUsersPosts = functions.firestore
  .document('users_posts/{usersPostsId}') // {usersPostsId} = {userId}_{postId}
  .onCreate((snap, context) => onCreateUsersPosts(db, snap, context));

// https://firebase.google.com/docs/firestore/solutions/schedule-export
const client = new firebase.firestore.v1.FirestoreAdminClient();
const bucket = `gs://${process.env.GCP_PROJECT}-firestore-exports`;
exports.scheduledFirestoreExport = functions.pubsub
  .schedule('0 2 * * *') // Everyday at 2am https://cloud.google.com/scheduler/docs/configuring/cron-job-schedules
  .onRun(context => {
    const databaseName = client.databasePath(
      process.env.GCP_PROJECT,
      '(default)'
    );

    return client
      .exportDocuments({
        name: databaseName,
        outputUriPrefix: bucket,
        collectionIds: ['users', 'posts', 'shares']
      })
      .then((responses: Array<any>) => {
        const response = responses[0];
        console.log(`Operation Name: ${response['name']}`);
        return response;
      })
      .catch((error: Error) => {
        console.error(error);
        throw new Error('Export operation failed');
      });
  });
