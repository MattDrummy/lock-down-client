import Ember from 'ember';

export default Ember.Controller.extend({
  appCont: Ember.inject.controller('application'),
  user: Ember.computed.alias('appCont.user'),
  room: "lobby",
  socketIOService: Ember.computed.alias('appCont.socketIOService'),
  url: Ember.computed.alias('appCont.url'),
  chatMessages:[],
  init(){
    this._super(...arguments);
    const socket = this.get('socketIOService').socketFor(this.get('url'))
    socket.emit('open', [
      this.get('user'),
      this.get('room'),
    ]);
    socket.on('close', (message)=>{
      this.set('chatMessages', this.get('chatMessages').concat(message))
    });
    socket.on('message', (message)=>{
      this.set('chatMessages', this.get('chatMessages').concat(message))
    });
  },
  willDestroyElement(){
    this._super(...arguments);
    const socket = this.get('socketIOService').socketFor(this.get('url'));
    socket.emit('close', [
      this.get('user'),
      this.get('room'),
    ]);
    this.get('socketIOService').closeSocketFor(this.get('url'))
  },
});
