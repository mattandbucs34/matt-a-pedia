require("dotenv").config();
const path = require("path");
const viewsFolder = path.join(__dirname, "..", "views");
const expressValidator = require("express-validator");
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require("express-flash");
const passportConfig = require("./passport-config");
const logger = require("morgan");

module.exports = {
  init(app, express) {
    app.set("views", viewsFolder);
    app.set("view engine", "ejs");
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(path.join(__dirname, "..", "assets")));
    app.use(expressValidator());
    app.use(logger("dev"));
    app.use(session({
      secret: process.env.cookieSecret,
      resave: false,
      saveUninitialized: false,
      cookie: {maxAge: 1.21e+9}
    }));
    app.use(flash());
    passportConfig.init(app);

    app.use((req, res, next) => {
      res.locals.currentUser = req.user;
      next();
    });

    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(bodyParser.json());
  }
};