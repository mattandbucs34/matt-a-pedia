const userQueries = require("../db/queries/userQueries");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");

module.exports = {

  signUp(req, res, next) {
    res.render("users/sign-up");
  },

  create(req, res, next) {
    let newUser = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      passwordConfirmation: req.body.passwordConfirmation
    };

    userQueries.createUser(newUser, (err, user) => {
      if(err) {
        req.flash("error", err);
        res.redirect("/users/sign-up");
      }else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully created an account!");
          res.redirect("/");
        });
      }
    });
  },

  signInForm(req, res, next) {
    res.render("users/sign-in");
  },

  signIn(req, res, next) {
    passport.authenticate("local")(req, res, () => {
      if(!req.user){
        req.flash("notice", "Sign in failed. Please try again.");
        res.redirect("/users/sign-in");
      }else {
        req.flash("notice", "You've successfully signed in!");
        res.redirect("/");
      }
    });
  },

  signOut(req, res, next) {
    req.logout();
    req.flash("notice", "You've successfully signed out!");
    res.redirect("/");
  },
}