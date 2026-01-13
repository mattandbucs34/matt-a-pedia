import "dotenv/config";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import session from "express-session";
import bodyParser from "body-parser";
const { urlencoded, json } = bodyParser;
import flash from "express-flash";
import { init as _init } from "./passport-config.js";
import logger from "morgan";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viewsFolder = join(__dirname, "..", "views");

export function init(app, express) {
  app.set("views", viewsFolder);
  app.set("view engine", "ejs");
  app.use(urlencoded({ extended: true }));
  app.use(express.static(join(__dirname, "..", "assets")));
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