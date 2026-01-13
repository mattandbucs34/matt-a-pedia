import { getUsers as getUsersQuery, addCollaborator as addCollaboratorQuery, getCollaborators as getCollaboratorsQuery, removeCollaborator as removeCollaboratorQuery } from "../db/queries/collabQueries.js";
import Authorizer from "../policies/collaborator.js";


export function newCollaborator(req, res, next) {
  const authorized = new Authorizer(req.user).new();
  if (authorized) {
    getUsersQuery(req, (err, result) => {
      if (err || result.wiki === undefined) {
        console.log(err);
        req.flash("error", "There are no users!");
        res.redirect("/");
      } else {
        res.render("collaborator/new", { ...result });
      }
    });
  } else {
    req.flash("notice", "You must be a premium member to do that!\nPlease upgrade!");
    res.redirect(`/users/${req.user.id}/profile`);
  }
}
export function createCollaborator(req, res, next) {
  let newCollaborator = {
    userId: req.body.selectUser,
    wikiId: req.params.wikiId
  };

  const authorized = new Authorizer(req.user).create();

  if (authorized) {
    addCollaboratorQuery(newCollaborator, (err, collaborator) => {
      if (err) {
        req.flash("error", err);
        res.redirect(`/wikis/${req.params.wikiId}`);
      } else {
        req.flash("notice", "A collaborator has been added.");
        res.redirect(`/wikis/${req.params.wikiId}/collaborator/new`);
      }
    });
  } else {
    req.flash("notice", "You are not authorized to do that!");
    res.redirect("/wikis");
  }
}
export function showCollaborator(req, res, next) {
  getCollaboratorsQuery(req, (err, result) => {
    res.render("/collaborator/show", { ...result });
  });
}
export function removeCollaborator(req, res, next) {
  const authorized = new Authorizer(req.user).destroy();

  if (authorized) {
    removeCollaboratorQuery(req, (err, collaborator) => {
      if (err) {
        req.flash("error", "No collaborators were removed");
        res.redirect(`/wikis/${req.params.wikiId}/collaborator/new`);
      } else {
        req.flash("notice", "Collaborator successfully removed");
        res.redirect(`/wikis/${req.params.wikiId}/collaborator/new`);
      }
    });
  } else {
    req.flash("notice", "You are not authorized to do that!");
    res.redirect(`/wikis/${req.params.wikiId}`);
  }
}