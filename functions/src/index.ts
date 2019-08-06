import * as functions from 'firebase-functions';
import { db } from './lib/Config';
import { _onCreateInboundShare } from './shares/create/InboundShare';
import { _onCreateShare } from './shares/create/v2';
import { onCreatePostAction } from './postActions/index';
import { _onWritePost } from './posts/Post';
import { _onWriteShare } from './shares';
import { _onCreateNotification } from './notifications/index';
import { onCreateUsersPosts } from './users_posts/create/index';

exports.onCreateDone = functions.firestore
  .document('dones/{doneId}')
  .onCreate((snap, context) => onCreatePostAction(db, snap, context));

exports.onCreateLike = functions.firestore
  .document('likes/{likeId}')
  .onCreate((snap, context) => onCreatePostAction(db, snap, context));

exports.onCreateNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate((snap, context) => _onCreateNotification(snap, context));

exports.onWritePost = functions.firestore
  .document('posts/{postId}')
  .onWrite((change, context) => _onWritePost(db, change, context));

exports.onWriteShare = functions.firestore
  .document('shares/{shareId}')
  .onWrite((change, context) => _onWriteShare(db, change, context));

exports.onCreateUsersPosts = functions.firestore
  .document('users_posts/{usersPostsId}') // {usersPostsId} = {userId}_{postId}
  .onCreate((snap, context) => onCreateUsersPosts(db, snap, context));
