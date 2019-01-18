'use strict';
module.exports = (sequelize, DataTypes) => {
  var Wikis = sequelize.define('Wikis', {
    title: {
      type:DataTypes.STRING,
      allowNull: false
    },

    body: {
      type: DataTypes.STRING,
      allowNull: false
    },
    private: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {});
  Wikis.associate = function(models) {
    // associations can be defined here
    Wikis.belongsTo(models.User, {
      foreignKey: "userId",
      onDelete: "CASCADE"
    });
  };
  return Wikis;
};