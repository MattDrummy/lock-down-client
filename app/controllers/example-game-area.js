import Ember from 'ember';

export default Ember.Controller.extend({
  appCont: Ember.inject.controller('application'),
  user: Ember.computed.alias('appCont.user'),
  room: Ember.computed.alias('appCont.room'),
  socketIOService: Ember.computed.alias('appCont.socketIOService'),
  url: Ember.computed.alias('appCont.url'),
  operatorCommands: Ember.computed.alias('appCont.operatorCommands'),
  operativeCommands: Ember.computed.alias('appCont.operativeCommands'),
  operatorFileStructure: Ember.computed.alias('appCont.operatorFileStructure'),
  operativeFileStructure: Ember.computed.alias('appCont.operativeFileStructure'),
  role: "operator",
  operatorPassword: Ember.computed(()=>{
    let result = ''
    let alpha = ['a','b','c','d',
    'e','f','g','h','i','j',
    'k','l','m','n','o','p',
    'q','r','s','t','u','v',
    'w','x','y','z']
    for (var i = 0; i < 8; i++) {
      let rand = Math.floor(Math.random()*2)
      if (rand%2 == 0) {
        rand = Math.floor(Math.random()*10)
        result += rand
      } else {
        rand = Math.floor(Math.random()*26)

        result += alpha[rand]
      }
    }
    return result;
  }),
  serverPort: Ember.computed(()=>{
    let num = Math.floor(Math.random()*1000);
    let result = '';
    if (num < 100) {
      result += "00"
    } else if (num < 1000) {
      result += "0"
    }
    result += num.toString();
    return result;
  })
});
