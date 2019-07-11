import { db } from '../Config';
// const db = require('../Config');
import { Batcher } from '@daviswhitehead/shayr-resources';
// const Batcher = require('@daviswhitehead/shayr-resources');
import * as _ from 'lodash';
// const _ = require('lodash');

const createUserActionCounts = (
  actionType: 'shares' | 'adds' | 'dones' | 'likes'
) =>
  db
    .collection('users')
    .get()
    .then(async (usersQuerySnapshot: any) => {
      console.log(`running for ${actionType}`);

      const preBatcher = new Batcher(db);
      const finalBatcher = new Batcher(db);
      const users: { [key: string]: any } = {};
      const actionsToGet: any = [];

      usersQuerySnapshot.forEach((doc: any) => {
        // if (doc.id !== '0') {
        //   return;
        // }

        const userId = doc.id;
        users[userId] = {
          ...doc.data(),
          ref: `users/${userId}`
        };
        console.log(`getting actions for user: ${userId}`);

        preBatcher.set(
          db.collection(`users`).doc(userId),
          {
            [`${actionType}Count`]: 0
          },
          {
            merge: true
          }
        );

        actionsToGet.push(
          db
            .collection(`${actionType}`)
            .where('userId', '==', userId)
            .get()
        );
      });

      preBatcher.write();

      await Promise.all(actionsToGet)
        .then(snapshots => {
          snapshots.forEach((actionQuerySnapshot: any) => {
            actionQuerySnapshot.forEach((doc: any) => {
              const data = doc.data();
              if (data.active) {
                users[data.userId] = {
                  ...users[data.userId],
                  [`${actionType}Count`]:
                    _.get(users, [data.userId, `${actionType}Count`], 0) + 1
                };
              }
            });
          });
          return true;
        })
        .catch(e => {
          console.error(e);
          return e;
        });

      _.forEach(users, (value, key) => {
        console.log(
          `writing count for: ${key}, count: ${_.get(
            users,
            [key, `${actionType}Count`],
            0
          )}`
        );
        finalBatcher.set(
          db.collection(`users`).doc(key),
          {
            [`${actionType}Count`]: _.get(users, [key, `${actionType}Count`], 0)
          },
          {
            merge: true
          }
        );
      });

      finalBatcher.write();
    });

createUserActionCounts('shares');
createUserActionCounts('adds');
createUserActionCounts('dones');
createUserActionCounts('likes');
