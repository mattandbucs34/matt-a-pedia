import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import models from "../db/models/index.js";
const User = models.User;
import { comparePass } from "../auth/helpers.js";

export function init(app) {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({
      where: { username }
    }).then((user) => {
      if (!user || !comparePass(password, user.password)) {
        return done(null, false, { message: "Invalid username or password" });
      }
      return done(null, user);
    });
  }));

  passport.serializeUser((user, callback) => {
    callback(null, user.id);
  });

  passport.deserializeUser((id, callback) => {
    User.findByPk(id).then((user) => {
      callback(null, user);
    }).catch((err) => {
      callback(err, user);
    });
  });
}