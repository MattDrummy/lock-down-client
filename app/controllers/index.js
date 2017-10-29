import Ember from 'ember';

export default Ember.Controller.extend({
  appCont: Ember.inject.controller('application'),
  loggedIn: Ember.computed.alias('appCont.loggedIn'),
  user: Ember.computed.alias('appCont.user'),
  email: Ember.computed.alias('appCont.email'),
  createGameRole: "operator",
  createGameEmail: "",
  actions: {
    createGame(modal){
      let c = this;
      let loggedIn = c.get('loggedIn')
      if (loggedIn) {
        let owner = c.get('user');
        let ownerRole = c.get('createGameRole');
        let email = c.get('createGameEmail');
        let publicRoom = email == "" ? true : false
        let operatorPassword = ''
        let alpha = ['a','b','c','d',
        'e','f','g','h','i','j',
        'k','l','m','n','o','p',
        'q','r','s','t','u','v',
        'w','x','y','z']
        for (var i = 0; i < 8; i++) {
          let rand = Math.floor(Math.random()*2)
          if (rand%2 == 0) {
            rand = Math.floor(Math.random()*10)
            operatorPassword += rand
          } else {
            rand = Math.floor(Math.random()*26)
            operatorPassword += alpha[rand]
          }
        }
        let operatorPort = (Math.floor(Math.random()*9000) + 1000).toString();
        let operativePort = Math.floor(Math.random()*9000) + 1000;
        while (operativePort == operatorPort) {
          operativePort = Math.floor(Math.random()*9000) + 1000;
        }
        let locations = [
          "botany",
          "hanger",
          "bridge",
          "medbay",
        ]
        let operativeLocation = locations[Math.floor(Math.random()*locations.length)];

        let post = c.get('store').createRecord('game', {
          owner, ownerRole, publicRoom, operatorPassword, operatorPort, operativePort, operativeLocation,
        });
        post.save()
        .then((response)=>response._internalModel.__data)
        .then(function(game){
          if (game.publicRoom) {
            c.transitionToRoute('game-lobby')
          }
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
