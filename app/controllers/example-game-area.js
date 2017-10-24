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
  operatorLocation: "engineering",
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
  operatorPort: Ember.computed(()=>{
    let num = Math.floor(Math.random()*9000) + 1000;
    return num.toString();
  }),
  operativePort: Ember.computed(function(){
    let num = Math.floor(Math.random()*9000) + 1000;
    while (num == this.get('serverPort')) {
      num = Math.floor(Math.random()*9000) + 1000;
    }
    return num;
  }),
  operativeLocation: Ember.computed(()=>{
    let locations = [
      "botany",
      "hanger",
      "bridge",
      "medbay",
    ]
    return locations[Math.floor(Math.random()*locations.length)];
  })
});
