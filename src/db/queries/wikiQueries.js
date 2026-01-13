import models from "../models/index.js";
const { Wikis: Wiki, Collaborator: Collab } = models;
import Authorizer from "../../policies/wikiPolicy.js";
import collabAuthorizer from "../../policies/collaborator.js";

export async function getAllWikis() {
    let result = {};
    try {
        const privateWikis = await Wiki.findAll({
            where: { private: true }
        });

        result["privateWikis"] = privateWikis;

        const publicWikis = await Wiki.findAll({
            where: { private: false }
        });

        result["publicWikis"] = publicWikis;

        return result;
    } catch (err) {
        return { error: err };
    }
}

export async function addWiki(newWiki) {
    try {
        const wiki = await Wiki.create(newWiki);
        return wiki;
    } catch (error) {
        return { error: error };
    }
}

export async function getWiki(req) {
    let result = {};
    try {
        const wiki = await Wiki.findByPk(req.params.id);
        result["wiki"] = wiki;

        const collaborator = await Collab.scope({ method: ["collaboratorFor", req.params.id] }).findOne({
            where: { userId: req.user.id }
        });
        result["collaborator"] = collaborator;

        return result;
    } catch (error) {
        return { error: error };
    }
}

export async function deleteWiki(req) {
    try {
        const wiki = await Wiki.findByPk(req.params.id);
        const authorized = new Authorizer(req.user, wiki).destroy();
        if (authorized) {
            wiki.destroy();
            return wiki;
        } else {
            req.flash("notice", "You must be signed in to do that!");
            return { error: "Forbidden" };
        }
    } catch (error) {
        return { error: error };
    }
}

export async function updateWiki(req, updatedWiki) {
    try {
        const wiki = await Wiki.findByPk(req.params.id);
        if (!wiki) {
            return { error: "Wiki not found" };
        }

        let result = {};
        const collaborator = await Collab.scope({ method: ["collaboratorFor", req.params.id] }).findOne({
            where: { userId: req.user.id }
        });
        result['collab'] = collaborator;

        let isAuthorized = false;
        if (collaborator != null) {
            isAuthorized = new collabAuthorizer(req.user, wiki, collaborator).update();
        } else {
            isAuthorized = new Authorizer(req.user, wiki).update();
        };

        if (isAuthorized) {

            const newWiki = await wiki.update(updatedWiki, {
                fields: Object.keys(updatedWiki)
            });
            return newWiki;
        } else {
            req.flash("notice", "You must be signed in to do that!");
            return { error: "Forbidden" };
        }
    } catch (error) {
        return { error: error };
    }
}

export async function getCollabs(id) {
    let result = {};
    try {
        const wiki = await Wiki.findByPk(id);
        if (!wiki) {
            return { error: "Wiki not found" };
        } else {
            result["wikis"] = wiki;

            const collabs = await Collab.scope({ method: ["collaboratorFor", id] }).all();
            result["collaborators"] = collabs;
            return result;
        }
    } catch (error) {
        return { error: error };
    }
}

export async function getCollaboration(id) {
    let result = {};
    try {
        const collaborators = await Collab.scope({ method: ["userCollaborationsFor", id] }).findAll();
        result["collaborations"] = collaborators;

        const publicWikis = await Wiki.findAll({
            where: { private: false }
        });
        result["publicWikis"] = publicWikis;

        const privateWikis = await Wiki.findAll({
            where: { private: true }
        });
        result["privateWikis"] = privateWikis;

        return result;
    } catch (err) {
        return { error: err };
    }
}