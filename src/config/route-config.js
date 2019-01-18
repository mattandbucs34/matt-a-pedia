module.exports = {
  init(app) {
    const staticRoutes = require("../routes/index-route");
    const userRoutes = require("../routes/users-routes");
    
    if(process.env.NODE_ENV === "test") {
      const mockAuth = require("../../spec/support/mock-auth.js");
      mockAuth.fakeIt(app);
    }

    app.use(staticRoutes);
    app.use(userRoutes);
  }
}