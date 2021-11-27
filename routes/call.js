const { createCall, deleteCallRecord } = require("../controllers/call");

const router = require("express").Router();

router.post("/createCall", createCall);
router.post("/deleteCall", deleteCallRecord);

module.exports = router;
