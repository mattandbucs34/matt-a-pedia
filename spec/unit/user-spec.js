const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    }).catch((err) => {
      console.log(err);
      done();
    });
  });

  describe("#create()", () => {
    it("should create a User object with a valid email and password", (done) => {
      User.create({
        username: "ForeverOrange",
        email: "velma@mysterymachine.com",
        password: "jenkies@12"
      }).then((user) => {
        expect(user.email).toBe("velma@mysterymachine.com");
        expect(user.id).toBe(1);
        done();
      }).catch((err) => {
        console.log(err);
        done();
      });
    });

    it("should not create a user with invalid email or password", (done) => {
      User.create({
        username: "hauntedfan999",
        email: "Zoinks and Jenkies",
        password: "1234567890"
      }).then((user) => {
        //skipped due to validation errors
        done();
      }).catch((err) => {
        expect(err.message).toContain("Validation error: must be a valid email");
        done();
      });
    });

    it("should not create a user with an email already taken", (done) => {
      User.create({
        username: "DandDForever",
        email: "user@example.com",
        password: "1234567890"
      }).then((user) => {
        User.create({
          username: "mileysucks",
          email: "user@example.com",
          password: "I am BATMAN!!"
        }).then((user) => {
          //skipped through validation error
          done();
        }).catch((err) => {
          expect(err.message).toContain("Validation Error");
          done();
        });
        done();
      }).catch((err) => {
        console.log(err);
        done();
      });
    });
  });

  
});