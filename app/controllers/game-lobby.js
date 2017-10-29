import Ember from 'ember';

export default Ember.Controller.extend({
  appCont: Ember.inject.controller('application'),
  user: Ember.computed.alias('appCont.user'),
  socketIOService: Ember.computed.alias('appCont.socketIOService'),
  url: Ember.computed.alias('appCont.url'),
  init(){
    let c = this;
    c.get('store').findAll('game');
  },
  actions: {
    deleteGame(timestamp){
      let c = this;
      c.get('store').queryRecord('game', { 'timestamp': timestamp, })
      .then((game)=>{
        game.deleteRecord();
        game.save();
      })
    },
    joinGame(timestamp){
    },
    enterGame(timestamp){
    }
  }
});
