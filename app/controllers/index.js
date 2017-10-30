import Ember from 'ember';

export default Ember.Controller.extend({
  appCont: Ember.inject.controller('application'),
  loggedIn: Ember.computed.alias('appCont.loggedIn'),
  user: Ember.computed.alias('appCont.user'),
  email: Ember.computed.alias('appCont.email'),
  socketIOService: Ember.computed.alias('appCont.socketIOService'),
  url: Ember.computed.alias('appCont.url'),
  createGameRole: "operator",
  createGameEmail: "",
  actions: {
    createGame(modal){
      let c = this;
      let loggedIn = c.get('loggedIn')
      if (loggedIn) {
        let owner = c.get('user');
        let ownerrole = c.get('createGameRole');
        let email = c.get('createGameEmail');
        let publicroom = email == "" ? true : false
        let operatorpassword = ''
        let alpha = ['a','b','c','d',
        'e','f','g','h','i','j',
        'k','l','m','n','o','p',
        'q','r','s','t','u','v',
        'w','x','y','z']
        for (var i = 0; i < 8; i++) {
          let rand = Math.floor(Math.random()*2)
          if (rand%2 == 0) {
            rand = Math.floor(Math.random()*10)
            operatorpassword += rand
          } else {
            rand = Math.floor(Math.random()*26)
            operatorpassword += alpha[rand]
          }
        }
        let operatorport = (Math.floor(Math.random()*9000) + 1000).toString();
        let operativeport = Math.floor(Math.random()*9000) + 1000;
        while (operativeport == operatorport) {
          operativeport = Math.floor(Math.random()*9000) + 1000;
        }
        let locations = [
          "botany",
          "hanger",
          "bridge",
          "medbay",
        ]
        let operativelocation = locations[Math.floor(Math.random()*locations.length)];

        let post = c.get('store').createRecord('game', {
          owner, ownerrole, publicroom, operatorpassword, operatorport, operativeport, operativelocation,
        });
        post.save()
        .then((response)=>response._internalModel.__data)
        .then(function(game){
          if (game.publicroom) {
            let url = c.get('url')
            const socket = c.get('socketIOService').socketFor(url)
            return socket.emit('gameAdded')
          }
        }).then(()=>{
          setTimeout(()=>{
            location.href = "/game-lobby"
          }, 100)
        }).catch((err)=>{
          let r = confirm(err.responseJSON.error)
          if (r) {
            c.get('store').queryRecord('game', {'owner':owner})
            .then((game)=>{
              game.deleteRecord();
              return game.save();
            })
            .then(()=>{
              location.href = "/"
            });
          }
        });

      } else {
        alert("You are not logged in, before you can create a game, you must create an account");
      }
      modal.close();
    },
    closeModal(modal){
      let c = this
      c.set('createGameRole', "operator")
      c.set('createGameEmail', "")
      modal.close()
    }
  }
});
