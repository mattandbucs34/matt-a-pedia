const wikiQueries = require("../db/queries/wikiQueries.js");
const Authorizer = require("../policies/application");
const collabAuthorizer = require("../policies/collaborator");
const markdown = require("markdown").markdown;

module.exports = {
  index(req, res, next) {
    if(req.user === undefined) {
      wikiQueries.getAllWikis((err, result) => {
        if(err) {
          res.redirect(500, "/index");
        }else {
          res.render("wikis/index", {...result});
        }
      });
    }else {
      wikiQueries.getCollaboration(req.user.id, (err, result) => {
        if(err || result === undefined) {
          req.flash("notice", "This user has no collaborations");
          res.redirect("/wikis");
        }else {
          res.render("wikis/index", {...result});
        }
      });
    }
    
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
        body: req.body.body,
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
    const authorized = new Authorizer(req.user).show();

    if(authorized) {
      wikiQueries.getWiki(req, (err, result)=> {
        if(err || result == null) {
          req.flash("notice", "You must be signed in to view that");
          res.redirect("/");
        }else {
          result.wiki.body = markdown.toHTML(result.wiki.body);
          res.render("wikis/show", {...result});
        }
      });
    }else {
      req.flash("notice", "You must be a premium member to view that!");
      res.redirect("/wikis");
    }
    
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
    wikiQueries.getWiki(req, (err, result) => {
      if(err || result == null) {
        res.redirect(404, "/");
      }else {
        wiki = result['wiki'];
        collaborator = result['collaborator'];
        
        if(collaborator == null) {
          authorized = new Authorizer(req.user, wiki).edit();
        }else if(collaborator != null) {
          authorized = new collabAuthorizer(req.user, wiki, collaborator).edit();
        }        
        
        if(authorized) {
          res.render("wikis/edit", {wiki});
        }else {
          req.flash("notice", "You are not authorized to do that!");
          res.redirect(`/wikis/${req.params.id}`);
        }
      }
    });
  },

  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if(err || wiki == null) {
        req.flash("notice", "That wiki was not found");
        res.redirect(`/wikis/${req.params.id}/edit`);
      }else {
        res.redirect(`/wikis/${req.params.id}`);
      }
    });
  },
  
  showCollaborators(req, res, next) {
    wikiQueries.getCollabs(req.params.id, (err, result) => {
      if(err || result.wiki === undefined) {
        req.flash("notice", "No wikis found with that information");
        res.redirect("/wikis");
      }else {
        res.render("wikis/collaborators", {...result});
      }
    });
  },

  showCollaborated(req, res, next) {
    wikiQueries.getCollaboration(req, (err, result) => {
      if(err || result === undefined) {
        req.flash("notice", "This user has no collaborations");
        res.redirect("/wikis");
      }else {
        console.log(result);
        res.render("/wikis/collabWikis", {...result});
      }
    });
  }
}