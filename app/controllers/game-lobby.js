import Ember from 'ember';

export default Ember.Controller.extend({
  appCont: Ember.inject.controller('application'),
  user: Ember.computed.alias('appCont.user'),
  socketIOService: Ember.computed.alias('appCont.socketIOService'),
  url: Ember.computed.alias('appCont.url'),
  lobbyChatMessages: [],
  lobby: "lobby",
  init(){
    let c = this;
    this.set('lobbyChatMessages', []);
    // this.get('store').findAll('game');
    // setInterval(()=>{
    //   this.get('store').findAll('game', {reload:true});
    // }, 10000)
  },
  actions: {
    deleteGame(timestamp){
      let c = this;
      c.get('store').queryRecord('game', { 'timestamp': timestamp, })
      .then((game)=>{
        game.deleteRecord();
        return game.save();
      })
    },
    joinGame(timestamp){
    },
    enterGame(timestamp){
    },
  }
});
