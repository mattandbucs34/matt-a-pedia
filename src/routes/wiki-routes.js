const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const validation = require("./validation-routes");

router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);

router.post("/wikis/create", validation.validateWiki, wikiController.create);

module.exports = router;