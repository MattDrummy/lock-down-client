import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-area'],
  socketIOService: Ember.inject.service('socket-io'),
  consoleInput: "",
  chatInput: "",
  consoleMessages: [],
  chatMessages: [],
  actions: {
    consoleEnter(input){
      this.set('consoleInput', input)
    },
    chatEnter(input){
      this.set('chatInput', input)
    }

  }
});
