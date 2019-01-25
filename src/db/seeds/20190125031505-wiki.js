'use strict';
const faker = require("faker");

let wikis = [];

for(let i = 0; i <= 15; i++) {
  wikis.push({
    title: faker.hacker.phrase(),
    body: faker.lorem.words(),
    private: faker.random.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: faker.random.number(15)
  });
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    //return queryInterface.removeConstraint("Wikis", "Wikis_userId_fkey", {}).then(() => {
      return queryInterface.bulkInsert("Wikis", wikis, {});
    //});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Wikis", null, {});
  }
};
