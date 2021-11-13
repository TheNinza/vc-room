const { config } = require("dotenv");
config();
module.exports = {
  FRONT_END:
    process.env.NODE_ENV === "production"
      ? process.env.FRONT_END_PROD
      : process.env.FRONT_END_DEV,
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
};
