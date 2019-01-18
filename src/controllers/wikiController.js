const wikiQueries = require("../db/queries/wikiQueries.js");
const Authorizer = require("../policies/wikiPolicy");

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if(err) {
        res.redirect(500, "static/index");
      }else {
        res.render("wikis/index", {wikis});
      }
    })
  },

  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();

    if(authorized) {
      res.render("wikis/new");
    }else {
      req.flash("notice", "You must be signed in to do that!");
      res.redirect("/wikis");
    }
  },

  create(req, res, next) {
    const authorized = new Authorizer(req,user).create();

    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.wikiBody,
        private: req.body.private,
      };

      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if(err) {
          res.redirect(500, "/wikis/new");
        }else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    }else {
      req.flash("notice", "You must be signed in to do that");
      res.redirect("/wikis");
    }
  },

  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki)=> {
      if(err || topic == null) {
        res.redirect(404, "/");
      }else {
        res.render("wikis/show");
      }
    });
  }
}