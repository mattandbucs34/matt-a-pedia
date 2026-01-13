'use strict';

export function up(queryInterface, Sequelize) {
  return queryInterface.addColumn(
    "Users",
    "role",
    {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: "standard"
    }
  );
}
export function down(queryInterface, Sequelize) {
  return queryInterface.removeColumn("Users", "role");
}
