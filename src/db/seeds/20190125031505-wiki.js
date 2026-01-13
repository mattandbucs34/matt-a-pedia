'use strict';
import { hacker, lorem, random } from "@faker-js/faker";

let wikis = [];

for (let i = 0; i <= 15; i++) {
  wikis.push({
    title: hacker.phrase(),
    body: lorem.words(),
    private: random.boolean(),
    createdAt: new Date(),
    updatedAt: new Date(),
    userId: random.number(15)
  });
}

export function up(queryInterface) {
  //return queryInterface.removeConstraint("Wikis", "Wikis_userId_fkey", {}).then(() => {
  return queryInterface.bulkInsert("Wikis", wikis);
  //});
}
export function down(queryInterface) {
  return queryInterface.bulkDelete("Wikis", null);
}
