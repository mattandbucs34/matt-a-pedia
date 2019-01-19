module.exports = {
  init(app) {
    const staticRoutes = require("../routes/index-route");
    const userRoutes = require("../routes/users-routes");
    const wikiRoutes = require("../routes/wiki-routes");
    
    if(process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    }

    app.use(staticRoutes);
    app.use(userRoutes);
    app.use(wikiRoutes);
  }
}