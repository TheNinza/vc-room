const { config } = require("dotenv");
config();
module.exports = {
  FRONT_END:
    process.env.NODE_ENV === "production"
      ? process.env.FRONT_END_PROD
      : process.env.FRONT_END_DEV,
  FIREBASE_CONFIG: process.env.FIREBASE_CONFIG,
  FIREBASE_BUCKET_NAME: process.env.FIREBASE_BUCKET_NAME,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
};
