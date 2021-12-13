const firebaseAdmin = require("firebase-admin");
const { getStorage } = require("firebase-admin/storage");
const { FIREBASE_CONFIG, FIREBASE_BUCKET_NAME } = require("./environments");

const firebaseConfig = JSON.parse(FIREBASE_CONFIG);

const firestoreApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
  storageBucket: FIREBASE_BUCKET_NAME,
});

const auth = firestoreApp.auth();
const firestore = firestoreApp.firestore();
const bucket = getStorage().bucket();
const serverTimestamp = firebaseAdmin.firestore.FieldValue.serverTimestamp;
const timestamp = firebaseAdmin.firestore.Timestamp.now;
const increment = firebaseAdmin.firestore.FieldValue.increment;
const arrayUnion = firebaseAdmin.firestore.FieldValue.arrayUnion;

module.exports = {
  auth,
  bucket,
  firestore,
  serverTimestamp,
  timestamp,
  increment,
  arrayUnion,
};
