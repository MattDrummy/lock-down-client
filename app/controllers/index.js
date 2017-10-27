import Ember from 'ember';

export default Ember.Controller.extend({
  createGameRole: "operator",
  createGamePassword: "",
  createGameEmail: "",
  actions: {
    createGame(modal){
      let role = this.get('createGameRole');
      let email = this.get('createGameEmail');
      let password = this.get('createGamePassword');
      modal.close();
    },
    closeModal(modal){
      this.set('createGameRole', "operator")
      this.set('createGameEmail', "")
      this.set('createGamePassword', "")
      modal.close()
    }
  }
});
