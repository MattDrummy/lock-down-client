import Ember from 'ember';

export default Ember.Controller.extend({
  createGameRole: "operator",
  createGamePassword: "",
  createGameEmail: "",
  actions: {
    createGame(modal){
      modal.close();
    },
    closeModal(modal){
      this.set('createGameRole', "")
      this.set('createGameEmail', "")
      this.set('createGamePassword', "")
      modal.close()
    }
  }
});
