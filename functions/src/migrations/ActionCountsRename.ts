import { db } from '../Config';
import { Batcher } from '@daviswhitehead/shayr-resources';
import * as _ from 'lodash';

console.log(db);

const clearUserActionCounts = async (
  actionType: 'shares' | 'adds' | 'dones' | 'likes'
) =>
  db
    .collection('posts')
    .get()
    .then(async (postsQuerySnapshot: any) => {
      console.log(`running for ${actionType}`);

      const preBatcher = new Batcher(db);
      const posts: { [key: string]: any } = {};

      postsQuerySnapshot.forEach((doc: any) => {
        // if (doc.id !== 'cd2qGlHClQvzHnO1m5xY') {
        //   return;
        // }

        const postId = doc.id;
        posts[postId] = {
          ...doc.data(),
          ref: `posts/${postId}`
        };
        console.log(`getting data for post: ${postId}`);

        preBatcher.set(
          db.collection(`posts`).doc(postId),
          {
            [`${actionType}Count`]: 0
          },
          {
            merge: true
          }
        );
        console.log(
          `writing count for: ${actionType}, post: ${postId}, count: ${_.get(
            posts,
            [postId, `${actionType.slice(0, -1)}Count`],
            0
          )}`
        );
      });

      preBatcher.write();
    });

const createUserActionCounts = async (
  actionType: 'shares' | 'adds' | 'dones' | 'likes'
) =>
  db
    .collection('posts')
    .get()
    .then(async (postsQuerySnapshot: any) => {
      console.log(`running for ${actionType}`);

      const finalBatcher = new Batcher(db);
      const posts: { [key: string]: any } = {};

      postsQuerySnapshot.forEach((doc: any) => {
        // if (doc.id !== 'cd2qGlHClQvzHnO1m5xY') {
        //   return;
        // }

        const postId = doc.id;
        posts[postId] = {
          ...doc.data(),
          ref: `posts/${postId}`
        };
        console.log(`getting data for post: ${postId}`);

        console.log(
          `writing count for: ${actionType}, post: ${postId}, count: ${_.get(
            posts,
            [postId, `${actionType.slice(0, -1)}Count`],
            0
          )}`
        );
        finalBatcher.set(
          db.collection(`posts`).doc(postId),
          {
            [`${actionType}Count`]: _.get(
              posts,
              [postId, `${actionType.slice(0, -1)}Count`],
              0
            )
          },
          {
            merge: true
          }
        );
      });

      finalBatcher.write();
    });

const clear = async () => {
  await clearUserActionCounts('shares');
  await clearUserActionCounts('adds');
  await clearUserActionCounts('dones');
  await clearUserActionCounts('likes');
};

const create = async () => {
  await createUserActionCounts('shares');
  await createUserActionCounts('adds');
  await createUserActionCounts('dones');
  await createUserActionCounts('likes');
};

clear();

setTimeout(function() {
  console.log('starting create');

  create();
}, 10000);
