export function index(req, res, next) {
  res.render("static/index", { title: "Welcome to Matt-a-Pedia" });
}