import { db } from '../lib/Config';
import { addCreatedAt, addUpdatedAt } from '../lib/Utility';

const createFriends = (database: any) =>
  database
    .collection('users')
    .get()
    .then((querySnapshot: any) => {
      const batchArray = [];
      batchArray.push(database.batch());
      let operationCounter = 0;
      let batchIndex = 0;

      // const batch = database.batch();
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

              batchArray[batchIndex].set(
                database
                  .collection('friends')
                  .doc(`${initiatingUserId}_${receivingUserId}`),
                addUpdatedAt(addCreatedAt(friendship))
              );
              operationCounter++;

              if (operationCounter === 100) {
                batchArray.push(database.batch());
                batchIndex++;
                operationCounter = 0;
              }
              // batch.set(
              //   database
              //     .collection('friends')
              //     .doc(`${initiatingUserId}_${receivingUserId}`),
              //   addUpdatedAt(addCreatedAt(friendship))
              // );
              console.log(receivingUserId);
            }
          }
          delete users[initiatingUserId];
        }
      }
      batchArray.forEach(async batch => await batch.commit());
      return;
    });

createFriends(db);
