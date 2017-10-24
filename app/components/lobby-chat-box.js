import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['chat-box'],
  chatInput: "",
  lobby: "lobby",
  lobbyChatMessages: [],
  fixScroll: (targetDiv)=>{
    setTimeout(()=>{
      let objDiv = document.getElementsByClassName(targetDiv)[0]
      objDiv.scrollTop = objDiv.scrollHeight;
    })
  },
  init(){
    this.set('lobbyChatMessages',[])
    this._super(...arguments);
    const socket = this.get('socketIOService').socketFor(this.get('url'))
    let user = this.get('user')
    let lobby = this.get('lobby')
    let lobbyChatMessages = this.get('lobbyChatMessages')
    socket.emit('open', [user,lobby]);
    socket.on('close', (message)=>{
      lobbyChatMessages.pushObject(message)
      this.get('fixScroll')('chat-window')
    });
    socket.on('message', (message)=>{
      lobbyChatMessages.pushObject(message)
      this.get('fixScroll')('chat-window')
    });

  },
  willDestroyElement(){
    this._super(...arguments);
    const socket = this.get('socketIOService').socketFor(this.get('url'));
    let user = this.get('user');
    let lobby = this.get('lobby');
    socket.emit('close', [user,lobby]);
    this.set('lobbyChatMessages', []);
    this.get('socketIOService').closeSocketFor(this.get('url'));
  },
  actions: {
    chatEnter(){
      const socket = this.get('socketIOService').socketFor(this.get('url'))
      let lobby = this.get('lobby');
      let user = this.get('user');
      let chatInput = this.get('chatInput')
      socket.emit("message", [lobby,`${user}: ${chatInput}`])
      this.set('chatInput', '')
      this.get('fixScroll')('chat-window')
    }
  }
});
