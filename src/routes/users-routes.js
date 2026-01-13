import { Router } from "express";
const router = Router();
import { validateUsers, validateSignIn } from "./validation-routes.js";
import { signUp, signInForm, signOutUser, showUserProfile, createNewUser, signInUser, upgradeUser, downgradeUser } from "../controllers/userController";

router.get("/users/sign-up", signUp);
router.get("/users/sign-in", signInForm);
router.get("/users/sign-out", signOutUser);
router.get("/users/:id", showUserProfile);

router.post("/users", validateUsers, createNewUser);
router.post("/users/sign-in", validateSignIn, signInUser);
router.post("/users/:id/upgrade", upgradeUser);
router.post("/users/:id/downgrade", downgradeUser);

export default router;