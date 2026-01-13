import { createUser, getUser, chargeUser, downgradeUser } from "../db/queries/userQueries.js";
import { authenticate } from "passport";
import { setApiKey, send } from "@sendgrid/mail";
setApiKey(process.env.SENDGRID_API_KEY);


export function signUp(req, res, next) {
  res.render("users/sign-up");
}
export function createNewUser(req, res, next) {
  let newUser = {
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirmation: req.body.confirmPW
  };

  const msg = {
    to: req.body.email,
    from: 'mattandbucs@gmail.com',
    subject: 'Matt-a-Pedia Registration',
    text: 'Thank you for registering for Matt-a-pedia. We are glad you joined us!',
    html: '<strong>Thank you for registering for Matt-a-pedia. We are glad you joined us!</strong>'
  };

  createUser(newUser, (err, user) => {
    if (err) {
      req.flash("error", err);
      res.redirect("/users/sign-up");
    } else {
      authenticate("local")(req, res, () => {
        req.flash("notice", "You've successfully created an account!");
        res.redirect("/");
      });
      send(msg);
    }
  });
}
export function signInForm(req, res, next) {
  res.render("users/sign-in");
}
export function signInUser(req, res, next) {
  authenticate("local")(req, res, () => {
    if (!req.user) {
      req.flash("notice", "Sign in failed. Please try again.");
      res.redirect("/users/sign-in");
    } else {
      req.flash("notice", "You've successfully signed in!");
      res.redirect("/");
    }
  });
}
export function signOutUser(req, res, next) {
  req.logout();
  req.flash("notice", "You've successfully signed out!");
  res.redirect("/");
}
export function showUserProfile(req, res, next) {
  getUser(req.params.id, (err, result) => {
    if (err || result.user === undefined) {
      req.flash("notice", "User with that ID not found.");
      res.redirect("/");
    } else {
      res.render("users/profile", { ...result });
    }
  });
}
export function chargeUser(req, res, next) {
  chargeUser(req, (err, charge) => {
    if (err || charge == null) {
      res.redirect(401, `/users/${req.user.id}`);
    } else {
      res.redirect(303, `/users/${req.user.id}`);
    }
  });
}
export function upgradeUser(req, res, next) {
  chargeUser(req, (err, charge) => {
    if (err || charge == null) {
      res.redirect(401, `/users/${req.user.id}`);
    } else {
      res.redirect(`/users/${req.user.id}`);
    }
  });
}
export function downgradeUser(req, res, next) {
  downgradeUser(req.params.id, (err, user) => {
    if (err || user === undefined) {
      req.flash("notice", "You are still a Premium Member");
      res.redirect(`/users/${user.id}`);
    } else {
      req.flash("success", "You are now a Standard Member");
      res.redirect(`/users/${user.id}`);
    }
  });
}