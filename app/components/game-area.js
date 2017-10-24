import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-area'],
  consoleInput: "",
  chatInput: "",
  consoleMessages: [],
  gameChatMessages: [],
  currNode: Ember.computed(function(){
    return this.get(`${this.get('role')}FileStructure`)
  }),
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
      let optionParams = this.get('consoleInput').split(' ').slice(2)
      let role = this.get('role');
      let currPath = this.get('currNode').path;
      let readOut = this.get('consoleMessages');
      let commandList = this.get(`${role}Commands`);
      let fileStructure = this.get(`${role}FileStructure`);
      let operatorPassword = this.get(`operatorPassword`);
      let port = this.get(`${role}Port`);
      let currLocation = this.get(`${role}Location`);
      let room = this.get('room');
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
        this.set('role', role == "operator" ? "operative" : "operator");
        readOut.pushObject(`${currPath} ${this.get('consoleInput')}`)
        readOut.pushObject(`Changed role to ${this.get('role')}`);
      } else {
        let operation = commandList.filter((e)=>{
          return e.command == command
        })[0]
        if (operation) {
          if (operation.run(data)) {
            const socket = this.get('socketIOService').socketFor(this.get('url'))
            socket.emit("message", [room, `YOU WIN!`])
            this.set('chatInput', '')
            this.get('fixScroll')('chat-window')
          }
        } else {
          readOut.pushObject(`${currPath} ${this.get('consoleInput')}`)
          readOut.pushObject("no such command exists")
        }
      }
      readOut.pushObject(currPath)
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
