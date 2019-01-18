const express = require("express");
const router = express.Router();
const wikiController = require("../controllers/wikiController");
const validation = require("./validation-routes");

router.get("/wikis", wikiController.index);