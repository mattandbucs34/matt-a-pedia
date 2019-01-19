const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/wikis";
const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wikis;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
  beforeEach((done) => {
    this.wiki;
    this.user;

    sequelize.sync({force: true}).then((res) => {
      User.create({
        username: "ForeverOrange",
        email: "velma@mysterymachine.com",
        password: "jenkies" 
      }).then((user) => {
        this.user = user;

        Wiki.create({
          title: "Inaugural Post about Matt",
          body: "When he was a young warthog...",
          private: false
        }).then((wiki) => {
          this.wiki = wiki;
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });

   describe("GET /wikis", () => {
     it("should return the Wikis view with all Wikis", (done) => {
       request.get(base, (err, res, body) => {
         expect(res.statusCode).toBe(200);
         expect(err).toBeNull();
         expect(body).toContain("Wiki-Matts");
         expect(body).toContain("Inaugural Post about Matt");
         done();
       });
     });
   });
});