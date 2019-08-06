import * as _ from 'lodash';
import { organizeFriends, logger } from '../lib/Utility';
import { sendPostDetailNotificationToFriends } from '../notifications/lib/Notifications';
import {
  getDocument,
  getDocumentsInCollection
} from '@daviswhitehead/shayr-resources';

const sharedActionResources = async (db: any, change: any, context: any) => {
  const beforeData = change.before.data() ? change.before.data() : {};
  const newAction = !!_.isEmpty(beforeData);
  const afterData = change.after.data();
  const post = await getDocument(db, `posts/${afterData.postId}`);
  const user = await getDocument(db, `users/${afterData.userId}`);
  let friends = await getDocumentsInCollection(
    db
      .collection('friends')
      .where('userIds', 'array-contains', afterData.userId)
      .where('status', '==', 'accepted')
  );
  friends = organizeFriends(afterData.userId, friends.documents);

  return {
    beforeData,
    newAction,
    afterData,
    post,
    user,
    friends
  };
};

// onWriteDone({before: {}, after: {active: true, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "0"}}, {params: {doneId: "0_JA81g0b9mPUp8FmchL9M"}})
export const _onWriteDone = async (db: any, change: any, context: any) => {
  // "dones/{doneId}" where doneId equals `${userId}_${postId}`

  return sharedActionResources(db, change, context)
    .then((resources: any) => {
      logger('resources');
      logger(resources);
      if (resources.newAction) {
        console.log('send a notification to friends');
        return sendPostDetailNotificationToFriends('dones', resources);
      }
      console.log('not sending notification due to old action');
      return resources;
    })
    .then(value => {
      console.log('success');
      return value;
    })
    .catch(e => {
      console.error(e);
      return e;
    });
};

// onWriteLike({before: {}, after: {active: true, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "m592UXpes3azls6LnhN2VOf2PyT2"}}, {params: {likeId: "0_JA81g0b9mPUp8FmchL9M"}})
// onWriteLike({before: {active: true, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "m592UXpes3azls6LnhN2VOf2PyT2"}, after: {active: false, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "m592UXpes3azls6LnhN2VOf2PyT2"}}, {params: {likeId: "0_JA81g0b9mPUp8FmchL9M"}})
export const _onWriteLike = async (db: any, change: any, context: any) => {
  // "likes/{likeId}" where likeId equals `${userId}_${postId}`

  return sharedActionResources(db, change, context)
    .then((resources: any) => {
      if (resources.newAction) {
        console.log('send a notification to friends');
        return sendPostDetailNotificationToFriends('likes', resources);
      }
      console.log('not sending notification due to old action');
      return resources;
    })
    .then(value => {
      console.log('success');
      return value;
    })
    .catch(e => {
      console.error(e);
      return e;
    });
};
