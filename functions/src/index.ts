import * as functions from 'firebase-functions';
import { db } from './lib/Config';
import { _onCreateInboundShare } from './shares/create/InboundShare';
import { _onCreateNewShare } from './shares/create/NewShare';
import { _onWriteAdd, _onWriteDone, _onWriteLike } from './posts/PostActions';
import { _onWritePost } from './posts/Post';
import { _onWriteShare } from './shares';
import { _onCreateNotification } from './notifications/index';

exports.onWriteAdd = functions.firestore
  .document('adds/{addId}')
  .onWrite((change, context) => _onWriteAdd(db, change, context));

exports.onWriteDone = functions.firestore
  .document('dones/{doneId}')
  .onWrite((change, context) => _onWriteDone(db, change, context));

exports.onWriteLike = functions.firestore
  .document('likes/{likeId}')
  .onWrite((change, context) => _onWriteLike(db, change, context));

exports.onCreateNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate((snap, context) => _onCreateNotification(snap, context));

exports.onWritePost = functions.firestore
  .document('posts/{postId}')
  .onWrite((change, context) => _onWritePost(db, change, context));

exports.onWriteShares = functions.firestore
  .document('shares/{shareId}')
  .onWrite((change, context) => _onWriteShare(db, change, context));
