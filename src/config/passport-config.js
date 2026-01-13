import { initialize, session, use, serializeUser, deserializeUser } from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../db/models";
import { comparePass } from "../auth/helpers";

export function init(app) {
  app.use(initialize());
  app.use(session());

  use(new LocalStrategy((username, password, done) => {
    User.findOne({
      where: { username }
    }).then((user) => {
      if (!user || !comparePass(password, user.password)) {
        return done(null, false, { message: "Invalid username or password" });
      }
      return done(null, user);
    });
  }));

  serializeUser((user, callback) => {
    callback(null, user.id);
  });

  deserializeUser((id, callback) => {
    User.findByPk(id).then((user) => {
      callback(null, user);
    }).catch((err) => {
      callback(err, user);
    });
  });
}