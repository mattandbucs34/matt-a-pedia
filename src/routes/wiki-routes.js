const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const validation = require("./validation-routes");
const helper = require("../auth/helpers");

router.get("/wikis", wikiController.index);
router.get("/wikis/new", wikiController.new);
router.get("/wikis/:id", wikiController.show);
router.get("/wikis/:id/edit", wikiController.edit);
router.get("/wikis/:id/collaborators", wikiController.showCollaborators);
/*router.get("/wikis/collabWikis", wikiController.showCollaborated); */

router.post("/wikis/create", helper.ensureAuthenticated, validation.validateWiki, wikiController.create);
router.post("/wikis/:id/destroy", wikiController.destroy);
router.post("/wikis/:id/update", validation.validateWiki, wikiController.update);

module.exports = router;