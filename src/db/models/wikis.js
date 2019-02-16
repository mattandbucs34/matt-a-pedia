'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wikis = sequelize.define('Wikis', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  Wikis.associate = function(models) {
    // associations can be defined here
    Wikis.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });

    Wikis.hasMany(models.Collaborator, {
      foreignKey: "wikiId",
      onDelete: "CASCADE"
    });
  };

  Wikis.addScope("privateWikis", () => {
    return {
      where: {private: true},
      order: [["createdAt", "ASC"]]
    }
  });

  Wikis.addScope("publicWikis", () => {
    return {
      where: {private: false},
      order: [["createdAt", "ASC"]]
    }
  });

  return Wikis;
};