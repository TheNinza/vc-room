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
app.get("/", (req, res) => {
  res.send("working");
});

// listner
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Hello from port ${port}`);
});
