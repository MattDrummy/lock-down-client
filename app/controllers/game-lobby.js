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
    c.set('lobbyChatMessages', []);
  },
  actions: {
    deleteGame(timestamp){
      let c = this;
      c.get('store').queryRecord('game', { 'timestamp': timestamp, })
      .then((game)=>{
        game.deleteRecord();
        game.save().then(()=>{
          let url = c.get('url');
          const socket = c.get('socketIOService').socketFor(url);
          socket.emit('deleteGame');
        });
      })
    },
    joinGame(timestamp, ownerrole){
      location.href = `/game/${ownerrole == "operator" ? "operative" : "operator"}/${timestamp}`
    },
    enterGame(timestamp, ownerrole){
      location.href = `/game/${ownerrole}/${timestamp}`
    }
  }
});
