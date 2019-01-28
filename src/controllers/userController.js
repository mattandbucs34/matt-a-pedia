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

  profile(req, res, next) {
    userQueries.getUser(req.params.id, (err, result) => {
      if(err || result.user === undefined) {
        req.flash("notice", "User with that ID not found.");
        res.redirect("/");
      }else {
        res.render("users/profile", {...result});
      }
    });
  },

  charge(req, res, next) {
    userQueries.chargeUser(req, (err, charge) => {
      if(err || charge === undefined) {
        req.flash("notice", "Upgrade failed");
        res.redirect("/");
      }else {
        userQueries.upgradeUser(req, (err, user) => {
          if(err || user === undefined) {
            req.flash("notice", "Your request to upgrade has been denied");
            res.redirect("/");
          }else {
            req.flash("success", "Your account has been upgraded to Premium");
            //res.render("/");
          }
        });
        res.redirect("/");
      }
    }); 
  },

  upgrade(req, res, next) {
    userQueries.upgradeUser(req, (err, user) => {
      if(err || user === undefined) {
        req.flash("notice", "Upgrade failed");
        res.redirect(`/users/${req.params.id}`);
      }else {
        req.flash("success", "You have upgraded to a Premium Account!");
        res.redirect(`/users/${req.params.id}`);
      }
    });
  },

  downgrade(req, res, next) {
    userQueries.downgradeUser(req.params.id, (err, user) => {
      if(err || user === undefined) {
        req.flash("notice", "You are still a Premium Member");
        res.redirect(`/users/${user.id}`);
      }else {
        req.flash("success", "You are now a Standard Member");
        res.redirect(`/users/${user.id}`)
      }
    });
  }
}