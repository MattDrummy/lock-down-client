import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: false,
  user: Ember.computed(()=>{
    return `guest${Math.ceil(Math.random()*9999)}`
  }),
  logInUsername: "",
  logInPassword: "",
  signUpUsername: "",
  signUpEmail: "",
  signUpPassword: "",
  room: "TEST",
  socketIOService: Ember.inject.service('socket-io'),
  url: 'ws://localhost:7000',
  sharedCommands: [
    {
      command: "--help",
      options: [],
      run: (data)=>{
        data.commandList.forEach((e)=>{
          data.readOut.pushObject(`${data.currNode} ${data.command}`)
          data.readOut.pushObject(`${e.command} : ${e.desc}`);
        })
      },
      desc: "lists commands and options for given command, or lists all commands if given on its own."
    },
  ],
  operatorCommands: Ember.computed(function(){
    return this.get('sharedCommands').concat([
      {
        command: "whoami",
        options: [],
        run: (data)=>{
          let user = this.get('user')
          data.readOut.pushObject(`${data.currNode} ${data.command}`)
          data.readOut.pushObject(`USER = ${user}`)
          data.readOut.pushObject(`ROLE = engineer`)
          data.readOut.pushObject(`PASSWORD = ${data.password}`)
        }
      },
      {
        command: "whereami",
        options: [],
        run: (data)=>{
          data.readOut.pushObject(`${data.currNode} ${data.command}`);
          data.readOut.pushObject(`LOCATION = engineering`);
          data.readOut.pushObject(`SERVER PORT = ${data.serverPort}`);
        }
      }
    ])
  }),
  operativeCommands: Ember.computed(function(){
    return this.get('sharedCommands').concat([
      {
        command: `door`,
        options: [
          `--open [password] : opens the door with supplied password`,
          `--init : initializes the door's connection to the console, requires server connection to console`,
          `--code : prints the code for the door, base64 encoded`
        ]
      }
    ])
  }),
  operatorFileStructure: Ember.computed(()=>{
    return {

    }
  }),
  operativeFileStructure: Ember.computed(()=>{
    return {

    }
  }),
  actions: {
    logIn(modal){
      if (this.get("logInUsername") != "" || this.get("logInPassword") != "") {
        this.set('user', this.get('logInUsername'))
        this.set('logInPassword', "")
        this.set('logInUsername', "")
        this.set('loggedIn', true);
        modal.close()
      }
    },
    logOut(){
      this.set('loggedIn', false);
      this.set('user', `guest${Math.ceil(Math.random()*9999)}`)
    },
    signUp(modal){
      if (this.get('signUpUsername') != "" || this.get("signUpEmail") != "" || this.get("signUpPassword") != "") {
        this.set("user", this.get("signUpUsername"))
        this.set('signUpUsername', '');
        this.set('signUpEmail', '');
        this.set('signUpPassword', '')
        this.set('loggedIn', true);
        modal.close()
      }
    },
    closeModal(modal){
      this.set('signUpUsername', '');
      this.set('signUpEmail', '');
      this.set('signUpPassword', '')
      this.set('logInPassword', "")
      this.set('logInUsername', "")
      modal.close();
    }
  }
});
