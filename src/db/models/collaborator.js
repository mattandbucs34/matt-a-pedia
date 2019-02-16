'use strict';
module.exports = (sequelize, DataTypes) => {
  var Collaborator = sequelize.define('Collaborator', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    wikiId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Collaborator.associate = function(models) {
    // associations are be defined here
    Collaborator.belongsTo(models.Wikis, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });

    Collaborator.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Collaborator.addScope('collaboratorFor', (wikiId) => {
      return {
        include: [{
          model: models.User,
          order: [["username", "ASC"]]
        }],
        where: {wikiId: wikiId},
      }
    });

    Collaborator.addScope('userCollaborationsFor', (userId) => {
      return {
        include: [{
          model: models.Wikis,
          order: [["createdAt", "ASC"]]
        }],
        where: {userId: userId},
        //order: [['username', 'ASC']]
      }
    });
  };
  return Collaborator;
};