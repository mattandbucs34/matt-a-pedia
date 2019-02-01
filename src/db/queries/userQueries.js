const User = require("../models").User;
const bcrypt = require("bcryptjs");
const Authorizer = require("../../policies/application");
const testKey = process.env.STRIPE_TEST_KEY;
const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = require("stripe")(secretKey);
console.log(secretKey);



module.exports = {
  createUser(newUser, callback) {
    const salt = bcrypt.genSaltSync();
    const hashedPassword = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPassword
    }).then((user) => {
      callback(null, user);
    }).catch((err) => {
      console.log(err);
      callback(err);
    })
  },

  getUser(id, callback) {
    let result = {};
    User.findByPk(id).then((user) => {
      if(!user) {
        callback(404);
      }else {
        result["user"] = user;
        callback(null, result)
      }
    }).catch((err) => {
      callback(err);
    });
  },

  chargeUser(req, callback) {
    stripe.charges.create({
      amount: 1500,
      description: "Premium Membership",
      currency: 'usd',
      source: req.body.id
    }).then((charge) => {
      return User.findByPk(req.params.id).then((user) => {
        user.role = "premium";
        return user.save().then(() => charge);
      })
    }).then((charge) => {
      callback(null, charge);
    }).catch((err) => {
      console.log("This is a dumb error:", err)
      callback(err);
    });
  },

  upgradeUser(req, callback) {
    User.findOne({where: {email: req.body.email}}).then((user) => {
      user.update({role: "premium"});
      callback(null, user);
    }).catch((err) => {
      callback(err);
    });
  },

  downgradeUser(id, callback) {
    return User.findByPk(id).then((user) => {
      if(!user) {
        return callback("User not found");
      }else {
        return user.update({role: "standard"}).then(() => {
          callback(null, user);
        }).catch((err) => {
          callback(err);
        });
      }
    });
  }
}