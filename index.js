require("dotenv").config();
const express = require("express");
const cors = require("cors");
const firebaseAdmin = require("firebase-admin");

/**
 * Firebase Admin Setup
 */
const firebaseConfig = JSON.parse(process.env.FIREBASE_CONFIG);

const firebaseApp = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(firebaseConfig),
});

const firestore = firebaseApp.firestore();
const auth = firebaseApp.auth();

/**
 * Express setup
 */

const app = express();

// middlewares

app.use(cors());
app.use(express.json());

// middleware to decode JWT for firebase auth
app.use(async (req, res, next) => {
  if (req.headers.authorization?.startsWith("Bearer ")) {
    const idToken = req.headers.authorization.split("Bearer ")[1];

    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      req["currentUser"] = decodedToken;
    } catch (error) {
      console.log(error);
    }
  }
  next();
});

// endpoints
// app.get("/", (req, res) => {
//   res.send("working");
// });

app.get("/", async (req, res) => {
  let uid = "mpeW1ufoiKTtsGyPTJ3ofRMyKT62";

  try {
    let friends = await getFriendsOfTheUser(uid);
    // set to contain friends
    const ownFriends = new Set(friends);
    ownFriends.add(uid);

    const suggestionSet = new Set();

    for (let i = 0; i < friends.length; i++) {
      const friends2ndLevel = await getFriendsOfTheUser(friends[i]);

      for (let j = 0; j < friends2ndLevel.length; j++) {
        if (!ownFriends.has(friends2ndLevel[j])) {
          suggestionSet.add(friends2ndLevel[j]);
        }

        const friends3rdLevel = await getFriendsOfTheUser(friends2ndLevel[j]);

        for (let k = 0; k < friends3rdLevel.length; k++) {
          if (!ownFriends.has(friends3rdLevel[k])) {
            suggestionSet.add(friends3rdLevel[k]);
          }
        }
      }
    }

    let suggestions = Array.from(suggestionSet);

    res.send(suggestions);
  } catch (err) {
    console.error(err);
    res.status(500).send({ err });
  }
});

// listner
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Hello from port ${port}`);
});

/*************************
 * Utility functions
 *************************/

async function getFriendsOfTheUser(uid) {
  const query = await firestore
    .collection("users")
    .doc(uid)
    .collection("friends");

  const { docs } = await query.get();

  const currentUserFriends = await Promise.all(
    docs.map(async (doc) => (await doc.data()).uid)
  );
  return currentUserFriends;
}
