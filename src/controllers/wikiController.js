const wikiQueries = require("../db/queries/wikiQueries.js");
const Authorizer = require("../policies/wikiPolicy");

module.exports = {
  index(req, res, next) {
    wikiQueries.getAllWikis((err, wikis) => {
      if(err) {
        console.log(err.message);
        res.redirect(500, "/index");
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
    const authorized = new Authorizer(req.user).create();

    if(authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.wikiBody,
        private: req.body.private,
        userId: req.user.id
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
      if(err || wiki == null) {
        res.redirect(404, "/");
      }else {
        res.render("wikis/show", {wiki});
      }
    });
  },

  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if(err) {
        res.redirect(err, `/wikis/${req.params.id}`);
      }else {
        res.redirect(303, "/wikis");
      }
    });
  },

  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(404, "/");
      }else {
        const authorized = new Authorizer(req.user, wiki).edit();

        if(authorized) {
          res.render("wikis/edit", {wiki});
        }else {
          req.flash("You are not authorized to do that!");
          req.redirect(`wikis/${req.params.id}`);
        }
      }
    });
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null) {
        res.redirect(401, `/wikis/${req.params.id}/edit`);
      }else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  }
}