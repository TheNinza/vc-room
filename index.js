const express = require("express");
const cors = require("cors");
const { auth, firestore } = require("./configs/firebase.js");
const { decodeJWT } = require("./middlewares/decodeJWT.js");
const suggestionsRoutes = require("./routes/suggestions.js");

/**
 * Express setup
 */

const app = express();

// middlewares

app.use(cors());
app.use(express.json());
app.use(decodeJWT);

// endpoints
app.get("/", (_req, res) => {
  res.redirect(FRONT_END);
});

app.use("/api/suggestions", suggestionsRoutes);

// listner
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Hello from port ${port}`);
});
