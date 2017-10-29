import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-area'],
  consoleInput: "",
  chatInput: "",
  consoleMessages: [],
  gameChatMessages: [],
  currNode: "",
  fixScroll: (targetDiv)=>{
    setTimeout(()=>{
      let objDiv = document.getElementsByClassName(targetDiv)[0]
      objDiv.scrollTop = objDiv.scrollHeight;
    })
  },
  init(){
    let c = this
    c._super(...arguments);
    c.set('gameChatMessages', [])
    c.set('consoleMessages', [])
    c.set('timestamp', this.model.timestamp);
    c.set('room', this.model.timestamp);
    c.set('role',this.model.role);
    let timestamp = this.model.timestamp;
    let role = this.model.role
    c.set('currNode', c.get(`${role}FileStructure`))
    let room = timestamp;
    this.get('model').games.then((response)=>{
      let games = response.content.map((e)=>{
        return e.__data
      }).filter((e)=>{
        return e.timestamp == timestamp
      })
      if (games.length != 1) {
        location.href = "/"
      } else {
        return games[0];
      }
    })
    .then((game)=>{
      console.log(game);
      let url = c.get('url')
      let user = c.get('user');
      let socket = c.get('socketIOService').socketFor(url)
      let gameChat = c.get('gameChatMessages');
      c.set('operativeLocation', game.operativeLocation);
      c.set('operativePort', game.operativePort);
      c.set('operatorPassword', game.operatorPassword);
      c.set('operatorPort', game.operatorPort);
      c.set('owner', game.owner);
      socket.emit('open', [user,room]);
      socket.on('close', (message)=>{
        gameChat.pushObject(message)
        c.get('fixScroll')('chat-window')
      });
      socket.on('message', (message)=>{
        gameChat.pushObject(message)
        c.get('fixScroll')('chat-window')
      });

    })
  },
  willDestroyElement(){
    let c = this
    c._super(...arguments);
    let url = c.get('url');
    let user = c.get('user');
    let room = c.get('room');
    const socket = c.get('socketIOService').socketFor(url);
    socket.emit('close', [user,room]);
    c.set('gameChatMessages', []);
    c.get('socketIOService').closeSocketFor(url)
  },
  actions: {
    consoleEnter(){
      let c = this;
      let command = c.get('consoleInput').split(' ')[0];
      let option = c.get('consoleInput').split(' ')[1];
      let optionParams = c.get('consoleInput').split(' ').slice(2)
      let role = c.get('role');
      let currPath = c.get('currNode').path;
      let readOut = c.get('consoleMessages');
      let commandList = c.get(`${role}Commands`);
      let fileStructure = c.get(`${role}FileStructure`);
      let operatorPassword = c.get(`operatorPassword`);
      let port = c.get(`${role}Port`);
      let currLocation = c.get(`${role}Location`);
      let room = c.get('room');
      let data = {
        commandList,
        fileStructure,
        readOut,
        currPath,
        command,
        option,
        operatorPassword,
        port,
        optionParams,
        currLocation,
      }
      if (command == "change") {
        c.set('role', role == "operator" ? "operative" : "operator");
        readOut.pushObject(`${currPath} ${c.get('consoleInput')}`)
        readOut.pushObject(`Changed role to ${c.get('role')}`);
      } else {
        let operation = commandList.filter((e)=>{
          return e.command == command
        })[0]
        if (operation) {
          if (operation.run(data)) {
            const socket = c.get('socketIOService').socketFor(c.get('url'))
            socket.emit("message", [room, `YOU WIN!`])
            c.set('chatInput', '')
            c.get('fixScroll')('chat-window')
          }
        } else {
          readOut.pushObject(`${currPath} ${c.get('consoleInput')}`)
          readOut.pushObject("no such command exists")
        }
      }
      readOut.pushObject(currPath)
      c.set('consoleInput', '')
      c.get('fixScroll')('console-window')

    },
    chatEnter(){
      let c = this
      const socket = c.get('socketIOService').socketFor(c.get('url'))
      let room = c.get('room');
      let user = c.get('user');
      let chatInput = c.get('chatInput')
      socket.emit("message", [room, `${user}: ${chatInput}`])
      c.set('chatInput', '')
      c.get('fixScroll')('chat-window')
    },
  },
});
