const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wikis;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
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
        });
      });
    });
  });

  describe("#create", () => {
    it("should create a Wiki with the given information", (done) => {
      Wiki.create({
        title: "Live action better than the real thing",
        body: "Simba was great as a cartoon, but live action will be amazing!",
        private: false
      }).then((wiki) => {
        expect(wiki.title).toBe("Live action better than the real thing");
        expect(wiki.body).toBe("Simba was great as a cartoon, but live action will be amazing!");
        expect(wiki.private).toBe(false);
        done();
      }).catch((err) => {
        console.log(err);
        done();
      });
    });
  });
});