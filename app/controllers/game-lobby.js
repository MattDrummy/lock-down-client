import Ember from 'ember';

export default Ember.Controller.extend({
  appCont: Ember.inject.controller('application'),
  user: Ember.computed.alias('appCont.user'),
  socketIOService: Ember.computed.alias('appCont.socketIOService'),
  url: Ember.computed.alias('appCont.url'),
  actions: {
    deleteGame(timestamp){
      let url = this.get('url')
      Ember.$.ajax({
        type: 'DELETE',
        url: `${url}/api/v1/games/${timestamp}`,
      }).then(function(){
        location.href = '/game-lobby'
      })
    }
  }
});
