import { Wikis as Wiki } from "../models";
import { Collaborator as Collab } from "../models";
import Authorizer from "../../policies/wikiPolicy";
import collabAuthorizer from "../../policies/collaborator";

export function getAllWikis(callback) {
  let result = {};
  Wiki.findAll({
    where: { private: true }
  })
    .then((privateWikis) => {
      result["privateWikis"] = privateWikis;

      Wiki.findAll({
        where: { private: false }
      })
        .then((publicWikis) => {
          result["publicWikis"] = publicWikis;
          callback(null, result);
        });
    }).catch((err) => {
      callback(err);;
    });
}

export function addWiki(newWiki, callback) {
  return Wiki.create(newWiki).then((wiki) => {
    callback(null, wiki);
  }).catch((err) => {
    callback(err);
  });
}

export function getWiki(req, callback) {
  let result = {};
  return Wiki.findByPk(req.params.id)
    .then((wiki) => {
      result["wiki"] = wiki;

      Collab.scope({ method: ["collaboratorFor", req.params.id] }).findOne({
        where: { userId: req.user.id }
      }).then((collaborator) => {
        result["collaborator"] = collaborator;
        callback(null, result);
      });
    }).catch((err) => {
      callback(err);
    });
}

export function deleteWiki(req, callback) {
  return Wiki.findById(req.params.id).then((wiki) => {
    const authorized = new Authorizer(req.user, wiki).destroy();
    if (authorized) {
      wiki.destroy().then((res) => {
        callback(null, wiki);
      });
    } else {
      req.flash("notice", "You must be signed in to do that!");
      callback(401);
    }
  }).catch((err) => {
    callback(err);
  });
}

export function updateWiki(req, updatedWiki, callback) {
  return Wiki.findByPk(req.params.id).then((wiki) => {
    if (!wiki) {
      return callback("Wiki not found");
    }

    let result = {};
    Collab.scope({ method: ["collaboratorFor", req.params.id] }).findOne({
      where: { userId: req.user.id }
    }).then((collaborator) => {
      result['collab'] = collaborator;

      collab = result['collab'];
      if (collab != null) {
        authorized = new collabAuthorizer(req.user, wiki, collab).update();
      } else {
        authorized = new Authorizer(req.user, wiki).update();
      };

      if (authorized) {

        wiki.update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        }).then(() => {
          callback(null, wiki);
        }).catch((err) => {
          callback(err);
        });
      } else {
        req.flash("notice", "You must be signed in to do that!");
        callback("Forbidden");
      }
    });
  });
}

export function getCollabs(id, callback) {
  let result = {};
  Wiki.findByPk(id)
    .then((wiki) => {
      if (!wiki) {
        callback(404);
      } else {
        result["wikis"] = wiki;

        Collab.scope({ method: ["collaboratorFor", id] }).all()
          .then((collabs) => {
            result["collaborators"] = collabs;
            callback(null, result);
          }).catch((err) => {
            callback(err);
          });
      }
    });
}

export function getCollaboration(id, callback) {
  let result = {};
  Collab.scope({ method: ["userCollaborationsFor", id] }).findAll()
    .then((collabs) => {
      result["collaborations"] = collabs;

      Wiki.findAll({
        where: { private: false }
      })
        .then((publicWikis) => {
          result["publicWikis"] = publicWikis;

          Wiki.findAll({
            where: { private: true }
          })
            .then((privateWikis) => {
              result["privateWikis"] = privateWikis;
              callback(null, result);
            });
        });
    }).catch((err) => {
      callback(err);
    });
}