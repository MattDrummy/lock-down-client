import Ember from 'ember';

export default Ember.Controller.extend({
  appCont: Ember.inject.controller('application'),
  user: Ember.computed.alias('appCont.user'),
  socketIOService: Ember.computed.alias('appCont.socketIOService'),
  url: Ember.computed.alias('appCont.url'),
  operatorCommands: Ember.computed.alias('appCont.operatorCommands'),
  operativeCommands: Ember.computed.alias('appCont.operativeCommands'),
  operatorFileStructure: Ember.computed.alias('appCont.operatorFileStructure'),
  operativeFileStructure: Ember.computed.alias('appCont.operativeFileStructure'),
  
});
