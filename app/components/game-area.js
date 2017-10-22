import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-area'],
  consoleInput: "",
  chatInput: "",
  actions: {
    consoleEnter(input){
      this.set('consoleInput', input)
    },
    chatEnter(input){
      this.set('chatInput', input)
    }

  }
});
