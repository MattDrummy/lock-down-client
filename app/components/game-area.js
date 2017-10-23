import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-area'],
  socketIOService: Ember.inject.service('socket-io'),
  consoleInput: "",
  chatInput: "",
  consoleMessages: [],
  chatMessages: [],
  url: 'ws://localhost:7000',
  didInsertElement(){
    this._super(...arguments);
    const socket = this.get('socketIOService').socketFor(this.get('url'))
    socket.emit('open', [
      this.get('user'),
      this.get('room'),
    ]);
    socket.on('message', (message)=>{
      this.set('chatMessages', this.get('chatMessages').concat(message))
    });
  },
  actions: {
    consoleEnter(){
    },
    chatEnter(){
      const socket = this.get('socketIOService').socketFor(this.get('url'))
      socket.emit("message", [
        this.get('room'),
        `${this.get('user')}: ${this.get('chatInput')}`
      ])
      this.set('chatInput', '')
    }
  },
});
