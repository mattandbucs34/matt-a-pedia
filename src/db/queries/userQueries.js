const User = require("../models").User;
const bcrypt = require("bcryptjs");
const Authorizer = require("../../policies/application");

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
    User.findById(id).then((user) => {
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

  upgradeUser(id, callback) {
    return User.findById(id).then((user) => {
      if(!user){
        return callback("User not found");
      }else {
        return user.update({ role: "premium"}).then(() => {
          callback(null, user);
        }).catch((err) => {
          callback(err);
        });
      };
    });
  },

  downgradeUser(id, callback) {
    return User.findById(id).then((user) => {
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