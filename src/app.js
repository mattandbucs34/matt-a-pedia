import express from "express";
const app = express();
import { init } from "./config/main-config.js";
import { init as _init } from "./config/route-config.js";

init(app, express);
_init(app);

export default app;