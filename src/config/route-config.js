import staticRoutes from "../routes/index-route.js";
import userRoutes from "../routes/users-routes.js";
import wikiRoutes from "../routes/wiki-routes.js";
import collabRoutes from "../routes/collaborator-routes.js";
import { fakeIt } from "../../spec/support/mock-auth.js";

export function init(app) {
  if (process.env.NODE_ENV === "test") {
    fakeIt(app);
  }

  app.use(staticRoutes);
  app.use(userRoutes);
  app.use(wikiRoutes);
  app.use(collabRoutes);
}