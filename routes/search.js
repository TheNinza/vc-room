const { people } = require("../controllers/search");

const router = require("express").Router();
router.get("/people", people);

module.exports = router;
