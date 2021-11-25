const { updateUser } = require("../controllers/user");

const router = require("express").Router();
router.post("/updateUser", updateUser);

module.exports = router;
