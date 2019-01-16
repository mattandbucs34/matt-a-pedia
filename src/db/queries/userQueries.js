const User = require("../models").User;
const bcrypt = require("bcryptjs");

module.exports = {
  createUser(newUser, callback){
    const salt = bcrypt.genSaltSync();
    const hashedPW = bcrypt.hashSync(newUser.password, salt);

    return User.create({
      username: newUser.username,
      email: newUser.email,
      password: hashedPW
    }).then((user) => {
      callback(null, user);
    }).catch((err) => {
      callback(err);
    });
  }
}