const {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
} = require("../controllers/friends");

const router = require("express").Router();
router.post("/sendFriendRequest", sendFriendRequest);
router.post("/acceptFriendRequest", acceptFriendRequest);
router.post("/declineFriendRequest", declineFriendRequest);

module.exports = router;
