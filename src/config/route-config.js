module.exports = {
  init(app) {
    const staticRoutes = require("../routes/index-route").default;
    const userRoutes = require("../routes/users-routes").default;
    const wikiRoutes = require("../routes/wiki-routes").default;
    const collabRoutes = require("../routes/collaborator-routes").default;

    if (process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    }

    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(wikiRoutes);
    app.use(collabRoutes);
  }
};