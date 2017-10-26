import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createGame(modal){
      modal.close();
    },
    closeModal(modal){
      modal.close()
    }
  }
});
