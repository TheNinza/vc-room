const { products } = require("../controllers/payments");

const router = require("express").Router();

router.get("/products", products);

module.exports = router;
