import * as firebase from 'firebase-admin';

firebase.initializeApp({
  credential: firebase.credential.applicationDefault()
});
const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
const msg = firebase.messaging();
export { firebase, db, msg };
