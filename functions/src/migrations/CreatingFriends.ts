import { Batcher } from '@daviswhitehead/shayr-resources';
import { db } from '../lib/Config';
import * as _ from 'lodash';

const createFriends = (database: any) => {
  const batcher = new Batcher(database);

  database
    .collection('users')
    .get()
    .then((querySnapshot: any) => {
      const users: { [key: string]: any } = {};

      querySnapshot.forEach((doc: any) => {
        const userId = doc.id;
        users[userId] = {
          ...doc.data(),
          ref: `users/${userId}`
        };
      });

      for (const initiatingUserId in users) {
        if (users.hasOwnProperty(initiatingUserId)) {
          console.log(initiatingUserId);
          for (const receivingUserId in users) {
            if (
              users.hasOwnProperty(receivingUserId) &&
              initiatingUserId !== receivingUserId
            ) {
              const friendship = {
                initiatingUserId: `${initiatingUserId}`,
                receivingUserId: `${receivingUserId}`,
                status: 'accepted',
                userIds: [initiatingUserId, receivingUserId]
              };

              batcher.set(
                database
                  .collection('friends')
                  .doc(`${initiatingUserId}_${receivingUserId}`),
                friendship
                // addUpdatedAt(addCreatedAt(friendship))
              );
              console.log(receivingUserId);
            }
          }
          delete users[initiatingUserId];
        }
      }
      const errors = batcher.write();
      console.log(errors);

      return;
    });
};

createFriends(db);
