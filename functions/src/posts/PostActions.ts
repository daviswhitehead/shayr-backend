import * as _ from 'lodash';
import {
  getDocument,
  addCreatedAt,
  addUpdatedAt,
  returnBatch,
  getDocumentsInCollection,
  organizeFriends,
  arrayUnion,
  arrayRemove
} from '../lib/Utility';
import { createPostAtom } from '../lib/Atoms';
import { sendPostDetailNotificationToFriends } from '../notifications/lib/Notifications';
import { updateCounts } from '../lib/Counters';

const createUserPostPayload = async (
  db: any,
  postAtom: any,
  userId: string,
  action: any,
  actionUserId: string,
  active: boolean
) => {
  const user_postRefString = `users_posts/${userId}_${postAtom.postId}`;
  const user_post = await getDocument(
    db.doc(user_postRefString),
    user_postRefString
  );
  let user_postPayload = addUpdatedAt({
    ...postAtom,
    userId,
    [action]: active ? arrayUnion(actionUserId) : arrayRemove(actionUserId)
  });

  user_postPayload = user_post
    ? user_postPayload
    : addCreatedAt(user_postPayload);

  return [
    db.doc(user_postRefString),
    user_postPayload,
    {
      merge: true
    }
  ];
};

const sharedActionResources = async (db: any, change: any, context: any) => {
  const beforeData = change.before.data() ? change.before.data() : {};
  const newAction = !!_.isEmpty(beforeData);
  const afterData = change.after.data();
  const post = await getDocument(
    db.doc(`posts/${afterData.postId}`),
    `posts/${afterData.postId}`
  );
  const user = await getDocument(
    db.doc(`users/${afterData.userId}`),
    `users/${afterData.userId}`
  );
  let friends = await getDocumentsInCollection(
    db
      .collection('friends')
      .where('userIds', 'array-contains', afterData.userId)
      .where('status', '==', 'accepted'),
    'friends'
  );
  friends = organizeFriends(afterData.userId, friends);

  return {
    beforeData,
    newAction,
    afterData,
    post,
    user,
    friends
  };
};

const sharedActionWrites = async (db: any, resources: any, action: any) => {
  const batch = db.batch();

  if (action === 'shares' && resources.newAction) {
    console.log('new share');

    updateCounts(
      batch,
      db,
      true,
      'shares',
      resources.post.id,
      resources.user.id,
      resources.user.id
    );
  }

  console.log('write Post to users_posts for self and friends');
  console.log(
    'update array of users sharing the matching Posts in users_posts object'
  );
  const postAtom = createPostAtom(resources.post);

  let user_post = await createUserPostPayload(
    db,
    postAtom,
    resources.user.id,
    action,
    resources.user.id,
    resources.afterData.active
  );
  batch.set(user_post[0], user_post[1], user_post[2]);

  for (const friendId in resources.friends) {
    if (resources.friends.hasOwnProperty(friendId)) {
      // eslint-disable-next-line no-await-in-loop
      user_post = await createUserPostPayload(
        db,
        postAtom,
        resources.friends[friendId].friendUserId,
        action,
        resources.user.id,
        resources.afterData.active
      );
      batch.set(user_post[0], user_post[1], user_post[2]);
    }
  }

  return returnBatch(batch);
};

// onWriteAdd({before: {}, after: {active: true, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "0"}}, {params: {addId: "0_JA81g0b9mPUp8FmchL9M"}})
export const _onWriteAdd = async (db: any, change: any, context: any) => {
  // "adds/{addId}" where addId equals `${userId}_${postId}`
  const resources = await sharedActionResources(db, change, context);

  return sharedActionWrites(db, resources, 'adds');
};

// onWriteDone({before: {}, after: {active: true, createdAt: null, postId: "JA81g0b9mPUp8FmchL9M", updatedAt: null, url: "https://hackernoon.com/5-tips-for-building-effective-product-management-teams-c320ce54a4bb", userId: "0"}}, {params: {doneId: "0_JA81g0b9mPUp8FmchL9M"}})
export const _onWriteDone = async (db: any, change: any, context: any) => {
  // "dones/{doneId}" where doneId equals `${userId}_${postId}`
  const resources = await sharedActionResources(db, change, context);

  return sharedActionWrites(db, resources, 'dones')
    .then(value => {
      if (resources.newAction) {
        console.log('send a notification to friends');
        return sendPostDetailNotificationToFriends('dones', resources);
      }
      console.log('not sending notification due to old action');
      return value;
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
  const resources = await sharedActionResources(db, change, context);

  return sharedActionWrites(db, resources, 'likes')
    .then(value => {
      if (resources.newAction) {
        console.log('send a notification to friends');
        return sendPostDetailNotificationToFriends('likes', resources);
      }
      console.log('not sending notification due to old action');
      return value;
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