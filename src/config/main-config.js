require("dotenv").config();
import { join } from "path";
const viewsFolder = join(__dirname, "..", "views");
import expressValidator from "express-validator";
import session from "express-session";
import { urlencoded, json } from "body-parser";
import flash from "express-flash";
import { init as _init } from "./passport-config";
import logger from "morgan";

export function init(app, express) {
  app.set("views", viewsFolder);
  app.set("view engine", "ejs");
  app.use(urlencoded({ extended: true }));
  app.use(express.static(join(__dirname, "..", "assets")));
  app.use(expressValidator());
  app.use(logger("dev"));
  app.use(session({
    secret: process.env.cookieSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1210000000 }
  }));
  app.use(flash());
  _init(app);

  app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
  });

  app.use(express.static("public"));
  app.use(urlencoded({ extended: false }));
  app.use(json());
}