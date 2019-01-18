const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users";
const User = require('../../src/db/models').User;
const Topic = require("../../src/db/models").Topic;
const Post = require("../../src/db/models").Post;
const Comment = require("../../src/db/models").Comment;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
  beforeEach((done) => {
    sequelize.sync({force: true}).then(() => {
      done();
    }).catch((err) => {
      console.log(err);
      done();
    });
  });

  describe("GET /users/sign-up", () => {
    it("should render a view with the sign up form", (done) => {
      request.get(`${base}/sign-up`, (err, res, body) => {
        expect(err).toBeNull();
        expect(body).toContain("Please sign up");
        done();
      });
    });
  });

  describe("POST /users", () => {
    it("should create a new user and redirect", (done) => {
      const options = {
        url: base,
        form: {
          username: "ForeverOrange",
          email: "velma@mysterymachine.com",
          password: "jenkies@12"
        }
      }

      request.post(options, (err, res, body) => {
        User.findOne({where: {email: "velma@mysterymachine.com"}}).then((user) => {
          expect(user).not.toBeNull();
          expect(user.username).toBe("ForeverOrange");
          expect(user.email).toBe("velma@mysterymachine.com");
          expect(user.id).toBe(1);
          done();
        }).catch((err) => {
          console.log(err);
          done();
        });
      });
    });
  });
});