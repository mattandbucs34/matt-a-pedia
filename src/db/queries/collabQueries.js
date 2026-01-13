import { Collaborator as Collab } from "../models";
import { Wikis as Wiki } from "../models";
import { User } from "../models";
import { Sequelize } from "sequelize";
const Op = Sequelize.Op;

export function getUsers(req, callback) {
  let result = {};
  Wiki.findByPk(req.params.wikiId)
    .then((wiki) => {
      if (!wiki) {
        callback(404);
      } else {
        result["wiki"] = wiki;

        User.findAll({
          where: { id: { [Op.ne]: req.user.id } },
          order: [["username", "ASC"]]
        })
          .then((users) => {
            result["users"] = users;

            Collab.scope({ method: ["collaboratorFor", req.params.wikiId] }).findAll()
              .then((collabs) => {
                result["collaborators"] = collabs;
                callback(null, result);
              }).catch((err) => {
                callback(err);
              });
          });
      }
    });
}

export function addCollaborator(newCollaborator, callback) {
  return Collab.create(newCollaborator)
    .then((collaborator) => {
      callback(null, collaborator);
    }).catch((err) => {
      callback(err);
    });
}

export function getCollaborators(req, callback) {
  let result = {};
  Wiki.findByPk(req.params.wikiId)
    .then((wiki) => {
      if (!wiki) {
        callback(404);
      } else {
        result["wiki"] = wiki;

        Collab.scope({ method: ["collaboratorFor", req.params.wikiId] }).all()
          .then((collabs) => {
            result["collaborators"] = collabs;
            callback(null, result);
          }).catch((err) => {
            callback(err);
          });
      }
    });
}

export function removeCollaborator(req, callback) {
  return Collab.findByPk(req.params.collaboratorId)
    .then((collab) => {
      collab.destroy()
        .then((res) => {
          callback(null, collab);
        });
    }).catch((err) => {
      callback(err);
    });
}