const { people } = require("../controllers/search");

const router = require("express").Router();
router.post("/people", people);

module.exports = router;
