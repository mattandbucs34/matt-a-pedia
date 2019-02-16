const express = require("express");
const router = express.Router();
const collabController = require("../controllers/collabController");
const validation = require("./validation-routes");
const helper = require("../auth/helpers");

router.get("/wikis/:wikiId/collaborator/new", collabController.new);

router.post("/wikis/:wikiId/collaborator/create", collabController.create);
router.post("/wikis/:wikiId/collaborator/:collaboratorId/remove", collabController.remove);

module.exports = router;