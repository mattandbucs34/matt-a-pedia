import bcrypt from "bcryptjs";
const { compareSync } = bcrypt;

export function ensureAuthenticated(req, res, next) {
  if (!req.user) {
    req.flash("notice", "You must be signed in to do that!");
    return res.redirect("/users/sign-in");
  } else {
    next();
  }
}
export function comparePass(userPassword, databasePassword) {
  return compareSync(userPassword, databasePassword);
}