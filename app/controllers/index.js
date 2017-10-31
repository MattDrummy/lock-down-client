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
          let url = c.get('url')
          if (game.publicroom) {
            let socket = c.get('socketIOService').socketFor(url)
            socket.emit('updateGameList')
            return
          } else {
            Ember.$.ajax({
              type: 'POST',
              url: `https://lock-down-web-server.herokuapp.com/email`,
              dataType: 'json',
              data: {
                subject: `Come play $lockDown with ${owner}`,
                recipient: email,
                body: `
                  <div style="background-color:#000700;color:rgb(50,200,50);padding:3em 2em;font-family:Courier,monospace;">
                    <h1 style="text-align:center;font-size:1.5em;">$lockDown</h1>

                    <p style="text-indent:2em; font-size:1.5em;">Greetings, you have been invited to come play a game of $lockDown from a friend of yours.  If you're interested, you don't even need an account.  All you have to is click the link below to play!  Fear not, you can play on your desktop or mobile web browser.</p>
                    <p style="text-indent:2em; font-size:1.5em;">In this game, you are stranded aboard a space station that has been deserted.  Most systems are offline, and most doors are on lockDown().  However, you are not alone!  There is another person stranded aboard the staiton, and with their help, you both may be able to escape to tell this tale.</p>
                    <p style="text-indent:2em; font-size:1.5em;">But, one of you is stranded in Engineering, unable to leave, the other is wandering the station.  Luckilly, both of you found a communication device to speak to each other.  Perhaps if you work together, you can over come the struggles of the station.</p>

                    <p style="text-indent:2em; font-size:1.5em;">Now is the time to decide if you're up for the challenge.  Click the link below and you will be transported into the game.</p>

                    <h2 style="text-align:center; font-size:1.5em;"><a href="https://lock-down-the-game.herokuapp.com/game/${ownerrole == "operator" ? "operative" : "operator"}/${game.timestamp}">ENTER GAME</a></h2>
                  </div>
                `
              }
            }).then(()=>{
              setTimeout(()=>{
                location.href = `/game/${game.ownerrole}/${game.timestamp}`
              }, 100)
            }).catch((err)=>{
              alert(err)
            })
          }
        })
        .then(()=>{
          setTimeout(()=>{
            location.href = `/`
          }, 500)
        })
        .catch((err)=>{
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
