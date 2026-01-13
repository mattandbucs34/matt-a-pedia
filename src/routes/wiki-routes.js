import { Router } from "express";
const router = Router();
import { index, newWiki, showWiki, editWiki, showCollaborators, createWiki, destroyWiki, updateWiki } from "../controllers/wikiController.js";
import { validateWiki } from "./validation-routes.js";
import { ensureAuthenticated } from "../auth/helpers.js";

router.get("/wikis", index);
router.get("/wikis/new", newWiki);
router.get("/wikis/:id", showWiki);
router.get("/wikis/:id/edit", editWiki);
router.get("/wikis/:id/collaborators", showCollaborators);
/*router.get("/wikis/collabWikis", wikiController.showCollaborated); */

router.post("/wikis/create", ensureAuthenticated, validateWiki, createWiki);
router.post("/wikis/:id/destroy", destroyWiki);
router.post("/wikis/:id/update", validateWiki, updateWiki);

export default router;