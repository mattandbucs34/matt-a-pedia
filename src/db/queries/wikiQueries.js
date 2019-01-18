const Wiki = require("../models").Wiki;
const Authorizer = require("../policies/wikiPolicy");

module.exports = {
  getAllWikis(callback) {
    return Wiki.all().then((wikis) => {
      callback(null, wikis);
    }).catch((err) => {
      callback(err);
    })
  }
}