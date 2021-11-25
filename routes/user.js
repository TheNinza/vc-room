const { updateUser, deleteUser } = require("../controllers/user");

const router = require("express").Router();
router.post("/updateUser", updateUser);
router.get("/deleteUser", deleteUser);

module.exports = router;
