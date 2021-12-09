const {
  products,
  checkout,
  retrieveSessionDetails,
  handleStripeWebhook,
} = require("../controllers/payments");

const router = require("express").Router();

router.get("/products", products);
router.post("/checkout", checkout);
router.post("/retrieveSessionDetails", retrieveSessionDetails);
router.post("/handleStripeWebhook", handleStripeWebhook);

module.exports = router;
