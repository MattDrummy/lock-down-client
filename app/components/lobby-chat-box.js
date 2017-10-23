import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['chat-box'],
  chatInput: "",
  lobby: "lobby",
  socketIOService: Ember.inject.service('socket-io'),
  url: 'ws://localhost:7000',
  lobbyChatMessages: [],
  init(){
    this._super(...arguments);
    const socket = this.get('socketIOService').socketFor(this.get('url'))
    socket.emit('open', [
      this.get('user'),
      this.get('lobby'),
    ]);
    socket.on('close', (message)=>{
      this.set('lobbyChatMessages', this.get('lobbyChatMessages').concat(message))
    });
    socket.on('message', (message)=>{
      this.set('lobbyChatMessages', this.get('lobbyChatMessages').concat(message))
    });
  },
  willDestroyElement(){
    this._super(...arguments);
    const socket = this.get('socketIOService').socketFor(this.get('url'));
    socket.emit('close', [
      this.get('user'),
      this.get('lobby'),
    ]);
    this.set('lobbyChatMessages', []);
    this.get('socketIOService').closeSocketFor(this.get('url'));
  },
  actions: {
    chatEnter(){
      const socket = this.get('socketIOService').socketFor(this.get('url'))
      socket.emit("message", [
        this.get('lobby'),
        `${this.get('user')}: ${this.get('chatInput')}`
      ])
      this.set('chatInput', '')
    }
  }
});
