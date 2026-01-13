import { Router } from "express";
const router = Router();
import { newCollaborator, createCollaborator, removeCollaborator } from "../controllers/collabController.js";

router.get("/wikis/:wikiId/collaborator/new", newCollaborator);

router.post("/wikis/:wikiId/collaborator/create", createCollaborator);
router.post("/wikis/:wikiId/collaborator/:collaboratorId/remove", removeCollaborator);

export default router;