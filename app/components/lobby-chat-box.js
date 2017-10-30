import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['chat-box'],
  chatInput: "",
  fixScroll: (targetDiv)=>{
    setTimeout(()=>{
      let objDiv = document.getElementsByClassName(targetDiv)[0]
      objDiv.scrollTop = objDiv.scrollHeight;
    })
  },
  init(){
    let c = this;
    c._super(...arguments);
    let user = c.get('user')
    let lobby = c.get('lobby')
    let lobbyChatMessages = c.get('lobbyChatMessages');
    let url = c.get('url')
    const socket = c.get('socketIOService').socketFor(url)
    socket.emit('open', [user,lobby]);
    socket.on('close', (message)=>{
      lobbyChatMessages.pushObject(message)
      c.get('fixScroll')('chat-window')
    });
    socket.on('message', (message)=>{
      lobbyChatMessages.pushObject(message)
      c.get('fixScroll')('chat-window')
    });
    socket.on('reloadLobby', ()=>{
      location.href = "/game-lobby"
    })
    socket.on('gameAdded', ()=>{
      c.get('store').findAll('game', {reload:true})
    })
  },
  willDestroyElement(){
    let c = this
    let url = c.get('url')
    let user = c.get('user');
    let lobby = c.get('lobby');
    c._super(...arguments);
    const socket = c.get('socketIOService').socketFor(url);
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
    },
  }
});
