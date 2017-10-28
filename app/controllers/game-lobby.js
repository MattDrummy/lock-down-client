import Ember from 'ember';

export default Ember.Controller.extend({
  appCont: Ember.inject.controller('application'),
  user: Ember.computed.alias('appCont.user'),
  socketIOService: Ember.computed.alias('appCont.socketIOService'),
  url: Ember.computed.alias('appCont.url'),
  model: Ember.computed.alias('appCont.model'),
  actions: {
    deleteGame(timestamp){
      this.get('store').queryRecord('game', {'timestamp':timestamp})
        .then(function(game){
          game.deleteRecord();
          game.save();
        })
    }
  }
});
