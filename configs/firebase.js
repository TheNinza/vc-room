const firebaseAdmin = require("firebase-admin");
const { FIREBASE_CONFIG } = require("./environments");

const firebaseConfig = JSON.parse(FIREBASE_CONFIG);

const firestoreApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
});

const auth = firestoreApp.auth();
const firestore = firestoreApp.firestore();
const serverTimestamp = firebaseAdmin.firestore.FieldValue.serverTimestamp;

module.exports = { auth, firestore, serverTimestamp };
