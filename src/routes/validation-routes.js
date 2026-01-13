import { check, validationResult } from "express-validator";

export const validateUsers = [
  check("username", "must be at least 6 characters in length").isLength({ min: 6 }),
  check("email", "must be valid").isEmail(),
  check("password", "must be at least 6 characters in length").isLength({ min: 6 }),
  check("confirmPW", "must match password provided").optional().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("passwords must match");
    }
    return true;
  }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect(req.headers.referer);
    }
    next();
  }
];

export const validateSignIn = [
  check("username", "must be at least 6 characters in length").isLength({ min: 6 }),
  check("password", "must be at least 6 characters in length").isLength({ min: 6 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect(req.headers.referer);
    }
    next();
  }
];

export const validateWiki = [
  check("title", "must be at least 5 characters in length").isLength({ min: 5 }),
  check("body", "must be at least 10 characters in length").isLength({ min: 10 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("error", errors.array());
      return res.redirect(req.headers.referer);
    }
    next();
  }
];