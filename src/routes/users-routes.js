const express = require("express");
const router = express.Router();
const validation = require("./validation-routes.js");
const userController = require("../controllers/userController");

router.get("/users/sign-up", userController.signUp);
router.get("/users/sign-in", userController.signInForm);
router.get("/users/sign-out", userController.signOut);
router.get("/users/:id", userController.profile);

router.post("/users", validation.validateUsers, userController.create);
router.post("/users/sign-in", validation.validateSignIn, userController.signIn);
router.post("/charge", userController.charge);
router.post("/users/:id/upgrade", userController.upgrade);
router.post("/users/:id/downgrade", userController.downgrade);

module.exports = router;