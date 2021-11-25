const {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  removeFriend,
} = require("../controllers/friends");

const router = require("express").Router();
router.post("/sendFriendRequest", sendFriendRequest);
router.post("/acceptFriendRequest", acceptFriendRequest);
router.post("/declineFriendRequest", declineFriendRequest);
router.post("/removeFriend", removeFriend);

module.exports = router;
