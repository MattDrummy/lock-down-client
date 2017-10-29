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
    let c = this;
    c.set('lobbyChatMessages',[])
    c._super(...arguments);
    const socket = this.get('socketIOService').socketFor(c.get('url'))
    let user = c.get('user')
    let lobby = c.get('lobby')
    let lobbyChatMessages = c.get('lobbyChatMessages')
    socket.emit('open', [user,lobby]);
    socket.on('close', (message)=>{
      lobbyChatMessages.pushObject(message)
      c.get('fixScroll')('chat-window')
    });
    socket.on('message', (message)=>{
      lobbyChatMessages.pushObject(message)
      c.get('fixScroll')('chat-window')
    });

  },
  willDestroyElement(){
    let c = this
    c._super(...arguments);
    const socket = c.get('socketIOService').socketFor(c.get('url'));
    let user = c.get('user');
    let lobby = c.get('lobby');
    socket.emit('close', [user,lobby]);
    c.set('lobbyChatMessages', []);
    c.get('socketIOService').closeSocketFor(c.get('url'));
  },
  actions: {
    chatEnter(){
      let c = this
      const socket = c.get('socketIOService').socketFor(c.get('url'))
      let lobby = c.get('lobby');
      let user = c.get('user');
      let chatInput = c.get('chatInput')
      socket.emit("message", [lobby,`${user}: ${chatInput}`])
      c.set('chatInput', '')
      c.get('fixScroll')('chat-window')
    }
  }
});
