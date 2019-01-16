module.exports = {
  init(app) {
    const staticRoutes = require("../routes/index-route");
    const userRoutes = require("../routes/users-routes");
    
    
    app.use(staticRoutes);
    app.use(userRoutes);
  }
}