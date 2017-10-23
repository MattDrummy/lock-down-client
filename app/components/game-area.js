import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-area'],
  consoleInput: "",
  consoleMessages: [],
  gameChatMessages: [],
  init(){
    this._super(...arguments);
    const socket = this.get('socketIOService').socketFor(this.get('url'))
    socket.emit('open', [
      this.get('user'),
      this.get('room'),
    ]);
    socket.on('close', (message)=>{
      this.set('gameChatMessages', this.get('gameChatMessages').concat(message))
    });
    socket.on('message', (message)=>{
      this.set('gameChatMessages', this.get('gameChatMessages').concat(message))
    });
  },
  willDestroyElement(){
    this._super(...arguments);
    const socket = this.get('socketIOService').socketFor(this.get('url'));
    socket.emit('close', [
      this.get('user'),
      this.get('room'),
    ]);
    this.set('gameChatMessages', []);
    this.get('socketIOService').closeSocketFor(this.get('url'))
  },
  actions: {
    consoleEnter(){
      this.set('consoleInput', '')
    },
  },
});
