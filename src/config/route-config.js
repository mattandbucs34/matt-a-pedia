module.exports = {
  init(app) {
    const staticRoutes = require("../routes/static-route");
    
    
    app.use(staticRoutes);
  }
}