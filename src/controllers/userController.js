const userQueries = require("../db/queries/userQueries.js");
const passport = require("passport");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const testKey = process.env.STRIPE_TEST_KEY;
const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")("sk_test_fqLhMCXdoWadGFZcMXuURp3q");

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
    stripe.customers.create({
      email: req.body.email,
      card: req.body.id
    }).then((customer) => {
      stripe.charges.create({
        amount: 1500,
        description: "Premium Membership",
        currency: 'usd',
        customer: customer.id
      }).then((charge) => {
        res.send(charge);
      }).catch((err) => {
        console.log(err);
        res.status(500).send({error: "Purchase Failed!"});
      });
    });
  },

  upgrade(req, res, next) {
    userQueries.upgradeUser(req.params.id, (err, user) => {
      if(err || user === undefined) {
        req.flash("notice", "Upgrade failed");
        res.redirect(`/users/${user.id}`);
      }else {
        req.flash("success", "You have upgraded to a Premium Account!");
        res.redirect(`/users/${user.id}`);
      }
    });
  },

  downgrade(req, res, next) {
    userQueries.downgradeUser(req.params.id, (err, user) => {
      if(err || user === undefined) {
        userQueries.getUser(req.params.id, (err, result) => {
          req.flash("notice", "You are still a Premium Member");
          res.redirect(`/users/${user.id}`);
        });
      }else {
        userQueries.getUser(user.id, (err, result) => {
          if(err || result.user === undefined) {
            req.flash("notice", "User with that ID not found.");
            res.redirect("/");
          }else {
            req.flash("success", "You are now a Standard Member");
            res.redirect(`/users/${user.id}`);
          }
        });
      }
    });
  }
}