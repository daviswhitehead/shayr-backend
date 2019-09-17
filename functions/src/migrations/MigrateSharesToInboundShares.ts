import _ from 'lodash';
import { db } from '../lib/Config';
import { Batcher } from '@daviswhitehead/shayr-resources';

const getShares = (database: any) =>
  database
    .collection('users')
    .get()
    .then(async (usersQuerySnapshot: any) => {
      const batcher = new Batcher(db);

      const users: { [key: string]: any } = {};
      const sharesToGet: any = [];

      usersQuerySnapshot.forEach((doc: any) => {
        const userId = doc.id;
        users[userId] = {
          ...doc.data(),
          ref: `users/${userId}`
        };
        sharesToGet.push(database.collection(`users/${userId}/shares`).get());
      });

      await Promise.all(sharesToGet)
        .then(snapshots => {
          snapshots.forEach((sharesQuerySnapshot: any) => {
            sharesQuerySnapshot.forEach((doc: any) => {
              const data = doc.data();
              batcher.set(
                database
                  .collection(`users/${doc.ref.parent.parent.id}/inboundShares`)
                  .doc(),
                {
                  createdAt: data.createdAt,
                  updatedAt: data.updatedAt,
                  url: data.url
                }
              );
            });
          });
          return true;
        })
        .catch(e => {
          console.error(e);
          return e;
        });

      const errors = await batcher.write();
      if (_.isEmpty(errors)) {
        console.log('success!');
      } else {
        console.error('failure :/');
      }

      return;
    });

getShares(db);
