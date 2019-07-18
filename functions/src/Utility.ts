import * as _ from 'lodash';
import { firebase, db } from './Config';

export const ts = firebase.firestore.FieldValue.serverTimestamp();
export const arrayUnion = (item: any) =>
  firebase.firestore.FieldValue.arrayUnion(item);
export const arrayRemove = (item: any) =>
  firebase.firestore.FieldValue.arrayRemove(item);
export const increment = (item: number) =>
  firebase.firestore.FieldValue.increment(item);

export const addCreatedAt = (payload: any) => ({
  ...payload,
  createdAt: ts
});

export const addUpdatedAt = (payload: any) => ({
  ...payload,
  updatedAt: ts
});

export const addDeletedAt = (payload: any) => ({
  ...payload,
  deletedAt: ts
});

export const getReferenceId = (reference: string, position: number) =>
  reference.split('/')[position];

export const getDocument = (query: any, ref: string) =>
  query.get().then((queryDocumentSnapshot: any) => {
    if (queryDocumentSnapshot.exists) {
      return {
        id: queryDocumentSnapshot.id,
        ref,
        ...queryDocumentSnapshot.data()
      };
    }
    return false;
  });
export const getDocumentsInCollection = (query: any, ref: string) => {
  // query = db.collection(ref).where("a", "==", "b")
  const obj: { [key: string]: any } = {};
  return query.get().then((querySnapshot: any) => {
    if (!querySnapshot.empty) {
      querySnapshot.forEach((doc: any) => {
        obj[doc.id] = {
          ref: `${ref}/${doc.id}`,
          ...doc.data()
        };
      });
      return obj;
    }
    return false;
  });
};

export const organizeFriends = (userId: string, friends: any) => {
  for (const friendId in friends) {
    if (friends.hasOwnProperty(friendId)) {
      friends[friendId].userId = userId;
      friends[friendId].friendUserId = _.remove(
        friends[friendId].userIds,
        id => id !== userId
      )[0];
    }
  }
  return friends;
};

export const returnBatch = (batch: any) =>
  batch
    .commit()
    .then((value: any) => {
      console.log('success');
      return value;
    })
    .catch((e: any) => {
      console.log('failure');
      console.error(e);
      return e;
    });

export class Batcher {
  batch: any;
  batchArray: Array<any>;
  batchIndex: number;
  operationCounter: number;
  operationCounterCutoff: number;

  constructor(operationCounterCutoff: number = 100) {
    this.batch = db.batch();
    this.batchArray = [this.batch];
    this.batchIndex = 0;
    this.operationCounter = 0;
    this.operationCounterCutoff = operationCounterCutoff;
  }

  incrementOperationCounter(operations: number) {
    this.operationCounter += operations;
  }

  set(
    reference: any,
    data: any,
    options: any,
    additionalOperations: number = 0
  ) {
    this.batchArray[this.batchIndex].set(reference, data, options);
    this.operationCounter += 1 + additionalOperations;

    if (this.operationCounter === this.operationCounterCutoff) {
      this.batchArray.push(db.batch());
      this.batchIndex += 1;
      this.operationCounter = 0;
    }
  }

  write() {
    this.batchArray.forEach(async batch => await batch.commit());
  }
}

export const getObjectDiff = (obj1: any, obj2: any) => {
  const diff = Object.keys(obj1).reduce((result, key) => {
    if (!obj2.hasOwnProperty(key)) {
      result.push(key);
    } else if (_.isEqual(obj1[key], obj2[key])) {
      const resultKeyIndex = result.indexOf(key);
      result.splice(resultKeyIndex, 1);
    }
    return result;
  }, Object.keys(obj2));

  return diff;
};
