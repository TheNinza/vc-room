import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSANGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;

// signing in with google
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = async () => {
  await auth.signInWithPopup(googleAuthProvider);
};

// getting userData from firestore

export const getUserDataFromUserAuth = async (user) => {
  const userRef = firestore.collection("users").doc(user.uid);
  const snapShot = await userRef.get();
  if (snapShot.exists) {
    return snapShot.data();
  } else {
    const batch = firestore.batch();

    const data = {
      uid: user.uid,
      displayName: user.displayName,
      status: "Hello There!! M new here",
      photoURL: user.photoURL,
      email: user.email,
      createdAt: serverTimestamp(),
      role: "user",
    };

    batch.set(userRef, data);

    // set accounts
    const accountsRef = firestore.collection("accounts").doc(user.uid);
    batch.set(accountsRef, {
      uid: user.uid,
      credits: 2,
    });

    await batch.commit();

    return await userRef.get().then((doc) => {
      return doc.data();
    });
  }
};
