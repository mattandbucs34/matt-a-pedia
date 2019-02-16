const ApplicationPolicy = require("./application");

module.exports = class CollaboratorPolicy extends ApplicationPolicy {

  _isCollaborator() {
    return this.user && (this.user.id == this.collaborator.User.id);
  }


  /* new() {
    return this._isPremium();
  }

  create() {
    return this.new();
  } */

  edit() {
    return this.new() &&  this.record && (this._isOwner() || this._isAdmin() || this._isCollaborator());
  }

  /* destroy() {
    return this._isPremium();
  } */
}