import { ts } from '@daviswhitehead/shayr-resources';
import { firebase } from '../lib/Config';

export const users = () => [
  {
    id: 0,
    ref: 'users/0',
    createdAt: ts(firebase.firestore),
    email: 'chillywilly.bootato@gmail.com',
    facebookProfilePhoto:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
    firstName: 'Bob',
    lastName: 'Sanders',
    updatedAt: ts(firebase.firestore)
  },
  {
    id: 1,
    ref: 'users/1',
    createdAt: ts(firebase.firestore),
    email: 'blue@blue.com',
    facebookProfilePhoto:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
    firstName: 'blue',
    lastName: 'blue',
    updatedAt: ts(firebase.firestore)
  },
  {
    id: 2,
    ref: 'users/2',
    createdAt: ts(firebase.firestore),
    email: 'yellow@yellow.com',
    facebookProfilePhoto:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
    firstName: 'yellow',
    lastName: 'yellow',
    updatedAt: ts(firebase.firestore)
  },
  {
    id: 3,
    ref: 'users/3',
    createdAt: ts(firebase.firestore),
    email: 'red@red.com',
    facebookProfilePhoto:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
    firstName: 'red',
    lastName: 'red',
    updatedAt: ts(firebase.firestore)
  },
  {
    id: 4,
    ref: 'users/4',
    createdAt: ts(firebase.firestore),
    email: 'green@green.com',
    facebookProfilePhoto:
      'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=255045858399396&height=100&width=100&ext=1537904540&hash=AeQ3M2Oc2lGYH5OP',
    firstName: 'green',
    lastName: 'green',
    updatedAt: ts(firebase.firestore)
  }
];
