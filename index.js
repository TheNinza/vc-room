const express = require("express");
const cors = require("cors");
const { decodeJWT } = require("./middlewares/decodeJWT.js");
const { FRONT_END, NODE_ENV } = require("./configs/environments.js");
const morgan = require("morgan");
const socketIO = require("socket.io");
const { auth, firestore, serverTimestamp } = require("./configs/firebase");

/**
 * Express setup
 */

const app = express();
// middlewares

app.use(
  cors({
    origin: FRONT_END,
  })
);

// setting rawBody for webhook handling
app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(decodeJWT);

// enable trust proxy for nginx reverse proxy
app.enable("trust proxy");
app.use(morgan(NODE_ENV === "production" ? "combined" : "dev"));

// endpoints
app.get("/", (_req, res) => {
  res.redirect(FRONT_END);
});

app.get("/api/ping", (_req, res) => {
  res.send("ponggggg!!!!");
});

app.use("/api/suggestions", require("./routes/suggestions.js"));
app.use("/api/friends", require("./routes/friends.js"));
app.use("/api/search", require("./routes/search.js"));
app.use("/api/call", require("./routes/call.js"));
app.use("/api/user", require("./routes/user.js"));
app.use("/api/payments", require("./routes/payments.js"));

// listner
const port = process.env.PORT || 8000;

const server = app.listen(port, () => {
  console.log(`Hello from port ${port} @ ${new Date().toLocaleString()}`);
});

// socket.io setup to detect presence for a user
const io = socketIO(server, {
  cors: {
    origin: FRONT_END,
  },
});

// socket.io events
io.on("connection", async (socket) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    socket.disconnect();
    return;
  }

  const currentUser = await auth.verifyIdToken(token);

  // set status online in firestore
  const { uid } = currentUser;
  const userRef = firestore.collection("users").doc(uid);

  const userSnapshot = await userRef.get();

  if (!userSnapshot.exists) {
    socket.disconnect();
    return;
  }

  const statusRef = firestore.collection("status").doc(uid);
  // set status online in status ref
  await statusRef.set({
    status: "online",
    timestamp: serverTimestamp(),
  });

  console.log(`${currentUser.email} is online`);

  socket.on("disconnect", async () => {
    // set status offline in firestore
    if ((await statusRef.get()).exists) {
      await statusRef.set({
        status: "offline",
        timestamp: serverTimestamp(),
      });
    }

    console.log(`${currentUser.email} is offline`);
  });
});
