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
    c.get('store').findAll('game');
    let url = c.get('url');
    c.set('lobbyChatMessages', []);
    const socket = c.get('socketIOService').socketFor(url)
  },
  actions: {
    deleteGame(timestamp){
      let c = this;
      c.get('store').queryRecord('game', { 'timestamp': timestamp, })
      .then((game)=>{
        game.deleteRecord();
        return game.save();
      })
      .then(()=>{
        let url = c.get('url')
        const socket = c.get('socketIOService').socketFor(url)
        socket.emit('updateRecord', '')
      })
    },
    joinGame(timestamp){
    },
    enterGame(timestamp){
    }
  }
});
