import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['chat-box'],
  chatInput: "",
  actions: {
    chatEnter(){
      const socket = this.get('socketIOService').socketFor(this.get('url'))
      socket.emit("message", [
        this.get('room'),
        `${this.get('user')}: ${this.get('chatInput')}`
      ])
      this.set('chatInput', '')
    }
  }
});
