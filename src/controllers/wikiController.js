import { getAllWikis, getCollaboration as getCollaborationQuery, addWiki as addWikiQuery, getWiki as getWikiQuery, deleteWiki as deleteWikiQuery, updateWiki as updateWikiQuery, getCollabs as getCollabsQuery } from "../db/queries/wikiQueries.js";
import Authorizer from "../policies/application.js";
import collabAuthorizer from "../policies/collaborator.js";
import { markdown } from "markdown";

export async function index(req, res) {
    if (req.user === undefined) {
        const result = await getAllWikis();
        if (result.error) {
            req.flash("notice", "Currently there are no Wikis");
            res.redirect("/index");
        } else {
            res.render("wikis/index", { ...result });
        }
    } else {
        const result = await getCollaborationQuery(req.user.id);
        if (result.error || result === undefined) {
            req.flash("notice", "This user has no collaborations");
            res.redirect("/wikis");
        } else {
            res.render("wikis/index", { ...result });
        }
    }
}

export function newWiki(req, res) {
    const authorized = new Authorizer(req.user).new();

    if (authorized) {
        res.render("wikis/new");
    } else {
        req.flash("notice", "You must be signed in to do that!");
        res.redirect("/wikis");
    }
}

export function createWiki(req, res) {
    const authorized = new Authorizer(req.user).create();

    if (authorized) {
        let newWiki = {
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.user.id
        };

        addWikiQuery(newWiki, (err, wiki) => {
            if (err) {
                res.redirect(500, "/wikis/new");
            } else {
                res.redirect(303, `/wikis/${wiki.id}`);
            }
        });
    } else {
        req.flash("notice", "You must be signed in to do that");
        res.redirect("/wikis");
    }
}

export function showWiki(req, res) {
    const authorized = new Authorizer(req.user).show();

    if (authorized) {
        getWikiQuery(req, (err, result) => {
            if (err || result == null) {
                req.flash("notice", "You must be signed in to view that");
                res.redirect("/");
            } else {
                result.wiki.body = markdown.toHTML(result.wiki.body);
                res.render("wikis/show", { ...result });
            }
        });
    } else {
        req.flash("notice", "You must be a premium member to view that!");
        res.redirect("/wikis");
    }

}
export function destroyWiki(req, res) {
    deleteWikiQuery(req, (err,) => {
        if (err) {
            res.redirect(err, `/wikis/${req.params.id}`);
        } else {
            res.redirect(303, "/wikis");
        }
    });
}

export function editWiki(req, res) {
    getWikiQuery(req, (err, result) => {
        if (err || result == null) {
            res.redirect(404, "/");
        } else {
            wiki = result['wiki'];
            collaborator = result['collaborator'];

            let authorized = false;
            if (collaborator == null) {
                authorized = new Authorizer(req.user, wiki).edit();
            } else if (collaborator != null) {
                authorized = new collabAuthorizer(req.user, wiki, collaborator).edit();
            }

            if (authorized) {
                res.render("wikis/edit", { wiki });
            } else {
                req.flash("notice", "You are not authorized to do that!");
                res.redirect(`/wikis/${req.params.id}`);
            }
        }
    });
}

export function updateWiki(req, res) {
    updateWikiQuery(req, req.body, (err, wiki) => {
        if (err || wiki == null) {
            req.flash("notice", "That wiki was not found");
            res.redirect(`/wikis/${req.params.id}/edit`);
        } else {
            res.redirect(`/wikis/${req.params.id}`);
        }
    });
}

export function showCollaborators(req, res) {
    getCollabsQuery(req.params.id, (err, result) => {
        if (err || result.wiki === undefined) {
            req.flash("notice", "No wikis found with that information");
            res.redirect("/wikis");
        } else {
            res.render("wikis/collaborators", { ...result });
        }
    });
}

export function showCollaborated(req, res) {
    getCollaborationQuery(req, (err, result) => {
        if (err || result === undefined) {
            req.flash("notice", "This user has no collaborations");
            res.redirect("/wikis");
        } else {
            console.log(result);
            res.render("/wikis/collabWikis", { ...result });
        }
    });
}