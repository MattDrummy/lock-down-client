import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-area'],
  consoleInput: "",
  chatInput: "",
  consoleMessages: [],
  gameChatMessages: [],
  currNode: "C://",
  updateConsole: false,
  fixScroll: (targetDiv)=>{
    setTimeout(()=>{
      let objDiv = document.getElementsByClassName(targetDiv)[0]
      objDiv.scrollTop = objDiv.scrollHeight;
    })
  },
  init(){
    this._super(...arguments);
    this.set('gameChatMessages', [])
    this.set('consoleMessages', [])
    const socket = this.get('socketIOService').socketFor(this.get('url'))
    const gameChat = this.get('gameChatMessages');
    let user = this.get('user');
    let room = this.get('room');
    socket.emit('open', [user,room]);
    socket.on('close', (message)=>{
      gameChat.pushObject(message)
      this.get('fixScroll')('chat-window')

    });
    socket.on('message', (message)=>{
      gameChat.pushObject(message)
      this.get('fixScroll')('chat-window')

    });
  },
  willDestroyElement(){
    this._super(...arguments);
    let url = this.get('url');
    let user = this.get('user');
    let room = this.get('room');
    const socket = this.get('socketIOService').socketFor(url);
    socket.emit('close', [user,room]);
    this.set('gameChatMessages', []);
    this.get('socketIOService').closeSocketFor(url)
  },
  actions: {
    consoleEnter(){
      let command = this.get('consoleInput').split(' ')[0];
      let option = this.get('consoleInput').split(' ')[1];
      let role = this.get('role');
      let currNode = this.get('currNode');
      let readOut = this.get('consoleMessages');
      let commandList = this.get(`${role}Commands`);
      let fileStructure = this.get(`${role}FileStructure`);
      let password = this.get(`operatorPassword`);
      let serverPort = this.get(`serverPort`);
      let data = {
        commandList,
        fileStructure,
        readOut,
        currNode,
        command,
        option,
        password,
        serverPort
      }
      if (command == "change") {
        this.set('role', role == "operator" ? "operative" : "operator");
        readOut.pushObject(`Changed role to ${role}`);
      } else {
        let operation = commandList.filter((e)=>{
          return e.command == command
        })[0]
        if (operation) {
          operation.run(data)
        } else {
          readOut.pushObject("no such command exists")
        }
      }
      readOut.pushObject(currNode)
      this.set('updateConsole', true);
      this.set('consoleInput', '')
      this.get('fixScroll')('console-window')

    },
    chatEnter(){
      const socket = this.get('socketIOService').socketFor(this.get('url'))
      let room = this.get('room');
      let user = this.get('user');
      let chatInput = this.get('chatInput')
      socket.emit("message", [room, `${user}: ${chatInput}`])
      this.set('chatInput', '')
      this.get('fixScroll')('chat-window')
    },
  },
});
