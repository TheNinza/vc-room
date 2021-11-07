require("dotenv").config();
const express = require("express");
const cors = require("cors");
const firebaseAdmin = require("firebase-admin");

/**
 * Defining globals
 */

const FRONT_END =
  process.env.NODE_ENV === "production"
    ? process.env.FRONT_END_PROD
    : process.env.FRONT_END_DEV;

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
app.use(async (req, _res, next) => {
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
app.get("/", (_req, res) => {
  res.redirect(FRONT_END);
});

app.get("/api/suggestions", async (req, res) => {
  try {
    let { uid } = validateUser(req);
    let friends = await getFriendsOfTheUser(uid);
    let suggestions = [];

    // if user has no friends
    if (!friends.length) {
      const query = firestore
        .collection("users")
        .where("uid", "!=", uid)
        .limit(10);
      const snapshot = await query.get();

      snapshot.docs.forEach((doc) => {
        suggestions.push(doc.id);
      });

      return res.status(200).json({
        suggestions,
        message: "ok",
      });
    }

    // set to contain friends
    const ownFriends = new Set(friends);
    ownFriends.add(uid);

    const suggestionSet = new Set();

    // traversing the freinds list and adding them to suggestions if not in suggestions already

    for (let i = 0; i < friends.length; i++) {
      const friends2ndLevel = await getFriendsOfTheUser(friends[i]);

      for (let j = 0; j < friends2ndLevel.length; j++) {
        if (!ownFriends.has(friends2ndLevel[j])) {
          suggestionSet.add(friends2ndLevel[j]);
        }
        if (suggestionSet.size > 10) break;

        const friends3rdLevel = await getFriendsOfTheUser(friends2ndLevel[j]);

        for (let k = 0; k < friends3rdLevel.length; k++) {
          if (!ownFriends.has(friends3rdLevel[k])) {
            suggestionSet.add(friends3rdLevel[k]);
          }
          if (suggestionSet.size > 10) break;
        }
      }
    }

    suggestions = Array.from(suggestionSet);

    shuffle(suggestions);

    res.status(200).json({
      suggestions,
      message: "ok",
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .send({ message: err?.message || "Some error occured", error: err });
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

function validateUser(req) {
  const user = req["currentUser"];
  if (!user) {
    throw new Error("You must be logged in to make this request!");
  }
  return user;
}

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}
