import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['command-console'],
  gameConsoleInput: "",
  actions: {
    consoleEnter(){
      this.set('gameConsoleInput', '')
    },
  },
});
