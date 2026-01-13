'use strict';

import { internet } from "@faker-js/faker";

let users = [];

for (let i = 1; i <= 15; i++) {
  users.push({
    username: internet.userName(),
    email: internet.email(),
    password: internet.password(),
    createdAt: new Date(),
    updatedAt: new Date()
  });
}

export function up(queryInterface) {
  return queryInterface.bulkInsert('Users', users);
}
export function down(queryInterface) {
  return queryInterface.bulkDelete('Users', null);
}
