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
        game.save();
        let url = c.get('url');
        c.get('socketIOService').closeSocketFor(url)
        return url
      })
      .then((url)=>{
        const socket = c.get('socketIOService').socketFor(url);
        socket.emit('gameDeleted');
        setTimeout(()=>{
          location.href = "/game-lobby";
        }, 1000)
      })
    },
    joinGame(timestamp, ownerrole){
      let c = this;
      let user = c.get('user');
      let url = c.get('url');
      c.get('store').queryRecord('game', {
        "timestamp": timestamp
      })
      .then((data)=>data._internalModel.__data)
      .then((game)=>{
        if (game.owner != user) {
          if (!game.publicroom) {
            alert("game is already in progress")
          } else {
            c.get('store').queryRecord('game', {
              "timestamp": timestamp,
            }).then((data)=>{
              data.set('publicroom', false);
              return data.save();
            }).then(()=>{
              const socket = c.get('socketIOService').socketFor(url)
              socket.emit('updateGameList')
              localStorage.user = c.get('user')
              alert('transporting...')
              setTimeout(()=>{
                location.href = `/game/${ownerrole == "operator" ? "operative" : "operator"}/${timestamp}`
              }, 500)

            })

          }
        }
      })
      .catch(()=>{
        alert("game does not exist");
        setTimeout(()=>{
          location.href = "/game-lobby"
        },100);
      })
    },
    enterGame(timestamp, ownerrole){
      let c = this;
      localStorage.user = c.get('user')
      location.href = `/game/${ownerrole}/${timestamp}`
    }
  }
});
