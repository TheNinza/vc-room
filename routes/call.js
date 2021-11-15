const { createCall } = require("../controllers/call");

const router = require("express").Router();

router.post("/createCall", createCall);

module.exports = router;
