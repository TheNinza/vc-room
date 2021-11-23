const { getSuggestions } = require("../controllers/suggestions");

const router = require("express").Router();

router.get("/", getSuggestions);

module.exports = router;
