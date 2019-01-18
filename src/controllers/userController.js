const userQueries = require("../db/queries/userQueries.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {

  signUp(req, res, next) {
    res.render("users/sign-up");
  },

  create(req, res, next) {
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
    
    userQueries.createUser(newUser, (err, user) => {
      if(err) {
        req.flash("error", err);
        res.redirect("/users/sign-up");
      }else {
        passport.authenticate("local")(req, res, () => {
          req.flash("notice", "You've successfully created an account!");
          res.redirect("/");
        });
        sgMail.send(msg);
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