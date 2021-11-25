const express = require("express");
const cors = require("cors");
const { decodeJWT } = require("./middlewares/decodeJWT.js");
const { FRONT_END } = require("./configs/environments.js");
const morgan = require("morgan");

/**
 * Express setup
 */

const app = express();

// middlewares

app.use(cors());
app.use(
  express.json({
    limit: "10mb",
  })
);
app.use(decodeJWT);
app.use(morgan("dev"));

// endpoints
app.get("/", (_req, res) => {
  res.redirect(FRONT_END);
});

app.get("/api/ping", (_req, res) => {
  res.send("pong");
});

app.use("/api/suggestions", require("./routes/suggestions.js"));
app.use("/api/friends", require("./routes/friends.js"));
app.use("/api/search", require("./routes/search.js"));
app.use("/api/call", require("./routes/call.js"));
app.use("/api/user", require("./routes/user.js"));

// listner
const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Hello from port ${port} @ ${new Date().toLocaleString()}`);
});
