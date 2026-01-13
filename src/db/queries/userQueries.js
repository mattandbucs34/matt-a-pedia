import models from "../models/index.js";
const User = models.User;
import bcrypt from "bcryptjs";
const { genSaltSync, hashSync } = bcrypt;
import Stripe from "stripe";
const secretKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secretKey);



export function getAllUsers(callback) {
  return User.findAll({
    order: [["username", "ASC"]]
  })
    .then((users) => {
      callback(null, users);
    }).catch((err) => {
      callback(err);
    });
}
export function createUser(newUser, callback) {
  const salt = genSaltSync();
  const hashedPassword = hashSync(newUser.password, salt);

  return User.create({
    username: newUser.username,
    email: newUser.email,
    password: hashedPassword
  }).then((user) => {
    callback(null, user);
  }).catch((err) => {
    console.log(err);
    callback(err);
  });
}
export function getUser(id, callback) {
  let result = {};
  User.findByPk(id).then((user) => {
    if (!user) {
      callback(404);
    } else {
      result["user"] = user;
      callback(null, result);
    }
  }).catch((err) => {
    callback(err);
  });
}
export function chargeUser(req, callback) {
  stripe.charges.create({
    amount: 1500,
    description: "Premium Membership",
    currency: 'usd',
    source: req.body.id
  }).then((charge) => {
    return User.findByPk(req.params.id).then((user) => {
      user.role = "premium";
      return user.save().then(() => charge);
    });
  }).then((charge) => {
    callback(null, charge);
  }).catch((err) => {
    console.log("This is a dumb error:", err);
    callback(err);
  });
}
export function upgradeUser(req, callback) {
  User.findOne({ where: { email: req.body.email } }).then((user) => {
    user.update({ role: "premium" });
    callback(null, user);
  }).catch((err) => {
    callback(err);
  });
}
export function downgradeUser(id, callback) {
  return User.findByPk(id).then((user) => {
    if (!user) {
      return callback("User not found");
    } else {
      return user.update({ role: "standard" }).then(() => {
        callback(null, user);
      }).catch((err) => {
        callback(err);
      });
    }
  });
}