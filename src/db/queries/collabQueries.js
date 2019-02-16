const Collab = require("../models").Collaborator;
const Wiki = require("../models").Wikis;
const User = require("../models").User;
const Authorizer = require("../../policies/application");
const Sequelize = require("sequelize").Sequelize;
const Op = Sequelize.Op;

module.exports = {
  getUsers(req, callback) {
    let result = {};
    Wiki.findByPk(req.params.wikiId)
    .then((wiki) => {
      if(!wiki) {
        callback(404);
      }else {
        result["wiki"] = wiki;

        User.findAll({
          where: {id: {[Op.ne]: req.user.id}},
          order: [["username", "ASC"]]
        })
        .then((users) => {
          result["users"] = users;

          Collab.scope({method: ["collaboratorFor", req.params.wikiId]}).findAll()
          .then((collabs) => {
            result["collaborators"] = collabs;
            callback(null, result);
          }).catch((err) => {
            callback(err);
          });
        });
      }
    });
  },

  addCollaborator(newCollaborator, callback) {
    return Collab.create(newCollaborator)
    .then((collaborator) => {
      callback(null, collaborator);
    }).catch((err) => {
      callback(err);
    });
  },

  getCollaborators(req, callback) {
    let result = {};
    Wiki.findByPk(req.params.wikiId)
    .then((wiki) => {
      if(!wiki) {
        callback(404);
      }else {
        result["wiki"] = wiki;

        Collab.scope({method: ["collaboratorFor", req.params.wikiId]}).all()
        .then((collabs) => {
          result["collaborators"] = collabs;
          callback(null, result);
        }).catch((err) => {
          callback(err);
        });
      }
    });
  },

  removeCollaborator(req, callback) {
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
}