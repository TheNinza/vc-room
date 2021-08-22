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

// signing in with google
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

export const signInWithGoogle = async () => {
  const { user } = await auth.signInWithPopup(googleAuthProvider);

  // save user details to firestore

  const userRef = firestore.collection("users").doc(user.uid);

  // check if user is already in database or not

  const snapShot = await userRef.get();

  if (!snapShot.exists) {
    /**
     * user:{uid, displayName, status, photoURL, email}
     */

    await userRef.set({
      uid: user.uid,
      displayName: user.displayName,
      status: "Hello There!! M new here",
      photoURL: user.photoURL,
      email: user.email,
    });
  } else {
  }
};

// getting userData from firestore

export const getUserDataFromUserAuth = async ({ uid }) => {
  const userRef = firestore.collection("users").doc(uid);
  const snapShot = await userRef.get();
  if (snapShot.exists) {
    return snapShot.data();
  } else {
    return null;
  }
};
