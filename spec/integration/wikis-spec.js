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
          private: false,
          userId: this.user.id
        }).then((wiki) => {
          this.wiki = wiki;
          done();
        /* }).catch((err) => {
          console.log("error");
          done(); */
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

  describe("Signed in free user performing CRUD operations", () => {
    beforeEach((done) => {
      /* User.create({
        username: "droppinanvils312",
        email: "wile.e.coyote@starving.com",
        password: "acmesucks"
      }).then((user) => { */
        request.get({
          url: "http://localhost:3000/auth/fake",
          form: {
            username: this.user.username,
            userId: this.user.id,
            email: this.user.email
          }
        }, (err, res, body) => {
          done();
        });
      /* }); */
    });
    
    describe("GET /wikis/new", () => {
      it("should render a form for a new wiki", (done) => {
        request.get(`${base}/new`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("New Wiki");
          done();
        });
      });
    });
  
    describe("POST /wikis/create", () => {
      const options = {
        url: `${base}/create`,
        form: {
          title: "Haunted Houses",
          wikiBody: "Haunted houses are full of ghosts"
        }
      };
      it("should create a new wiki and redirect", (done) => {
        request.post(options, (err, res, body) => {
          Wiki.findOne({where: {title: "Haunted Houses"}}).then((wiki) => {
            expect(wiki).not.toBeNull();
            expect(wiki.title).toBe("Haunted Houses");
            expect(wiki.body).toBe("Haunted houses are full of ghosts");
            done();
          }).catch((err) => {
            console.log(err);
            done();
          });
        });
      });
    });
  
    describe("GET /wikis/:id", () => {
      it("should render a view with the selected topic", (done) => {
        request.get(`${base}/${this.wiki.id}`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Inaugural Post about Matt");
          done();
        });
      });
    });

    describe("POST /wikis/:id/destroy", () => {
      it("should delete the wiki with the associated id", (done) => {
        Wiki.findAll().then((wikis) => {
          const wikisCount = wikis.length;

          expect(wikisCount).toBe(1);
          
          request.post(`${base}/${this.wiki.id}/destroy`, (err, res, body) => {
            Wiki.findAll().then((wikis) => {
              expect(err).toBeNull();
              expect(wikis.length).toBe(wikisCount - 1);
              done();
            });
          });
        });
      });
    });

    describe("GET /wikis/:id/edit", () => {
      it("should render a view to edit a wiki", (done) => {
        request.get(`${base}/${this.wiki.id}/edit`, (err, res, body) => {
          expect(err).toBeNull();
          expect(body).toContain("Edit Wiki");
          expect(body).toContain("Inaugural Post about Matt");
          done();
        });
      });
    });

    describe("POST /wikis/:id/update", () => {
      it("should update the selected Wiki with new information", (done) => {
        const options = {
          url: `${base}/${this.wiki.id}/update`,
          form: {
            title: "Nah, this is just a fun Wiki",
            wikiBody: "Fun, fun, fun....fun in the sun!" 
          }
        };

        request.post(options, (err, res, body) => {
          expect(err).toBeNull();
          Wiki.findOne({
            where: {id: this.wiki.id}
          }).then((wiki) => {
            expect(wiki.title).toBe("Nah, this is just a fun Wiki");
            done();
          });
        });
      });
    });
  });
});