const express = require("express");
const cors = require("cors");
const { decodeJWT } = require("./middlewares/decodeJWT.js");
const { FRONT_END } = require("./configs/environments.js");

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

app.use("/api/suggestions", require("./routes/suggestions.js"));
app.use("/api/friends", require("./routes/friends.js"));

// listner
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Hello from port ${port}`);
});
