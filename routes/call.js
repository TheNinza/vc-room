const {
  createCall,
  deleteCallRecord,
  acceptCall,
} = require("../controllers/call");

const router = require("express").Router();

router.post("/createCall", createCall);
router.post("/acceptCall", acceptCall);
router.post("/deleteCall", deleteCallRecord);

module.exports = router;
