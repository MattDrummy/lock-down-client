import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['game-area'],
  socketIOService: Ember.inject.service('socket-io'),
  consoleInput: null,
  chatInput: null,
  consoleMessages: [],
  chatMessages: [],
  room: "TEST",
  url: 'ws://localhost:7000',
  init(){
    this._super(...arguments);
    const socket = this.get('socketIOService')
  },
  actions: {
    consoleEnter(){
    },
    chatEnter(){
    }
  },
});
