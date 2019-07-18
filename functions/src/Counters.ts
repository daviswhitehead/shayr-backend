import { ts, increment, arrayRemove, arrayUnion } from './Utility';

// export const getUpdatedCount = (
//   db: any,
//   ref: string,
//   activeToggle: boolean,
//   counterType: string
// ) =>
//   db
//     .doc(ref)
//     .get()
//     .then((doc: any) => {
//       const data = doc.data();

//       // get counter value or initialize
//       let count = data[counterType] ? data[counterType] : 0;

//       // increment counter
//       if (activeToggle) {
//         count += 1;
//       } else {
//         count -= 1;
//       }

//       // updated counter payload
//       const payload: { [key: string]: any } = {};
//       payload[counterType] = count;
//       return payload;
//     });

export const updateCounts = (
  batcher: any,
  db: any,
  isIncremental: boolean,
  action: any,
  postId: any,
  ownerUserId: any,
  userId: any
) => {
  // posts/{postId} { {action}Count: +1 }
  batcher.set(
    db.collection('posts').doc(postId),
    {
      [`${action}Count`]: increment(isIncremental ? 1 : -1),
      updatedAt: ts
    },
    {
      merge: true
    }
  );
  // users_posts/{ownerUserId}_{postId} { {action}Count: +1, {action}: +{userId} }
  batcher.set(
    db.collection('users_posts').doc(`${ownerUserId}_${postId}`),
    {
      [`${action}Count`]: increment(isIncremental ? 1 : -1),
      [`${action}`]: isIncremental ? arrayUnion(userId) : arrayRemove(userId),
      updatedAt: ts
    },
    {
      merge: true
    }
  );
  if (ownerUserId != userId) {
    // users_posts/{userId}_{postId} { {action}Count: +1, {action}: +{userId} }
    batcher.set(
      db.collection('users_posts').doc(`${userId}_${postId}`),
      {
        [`${action}Count`]: increment(isIncremental ? 1 : -1),
        [`${action}`]: isIncremental ? arrayUnion(userId) : arrayRemove(userId),
        updatedAt: ts
      },
      {
        merge: true
      }
    );
  }
  // users/{userId} { {action}Count: +1 }
  batcher.set(
    db.collection('users').doc(userId),
    {
      [`${action}Count`]: increment(isIncremental ? 1 : -1),
      updatedAt: ts
    },
    {
      merge: true
    }
  );
};
