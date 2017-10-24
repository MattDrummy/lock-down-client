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

  // COMMANDS SHARED BY BOTH USERS

  sharedCommands: [
    {
      command: "--help",
      options: [],
      desc: "lists commands and options for given command, or lists all commands if given on its own.",
      run: (data)=>{
        data.readOut.pushObject(`${data.currNode} ${data.command}`)
        data.commandList.forEach((e)=>{
          data.readOut.pushObject(`${e.command} : ${e.desc}`);
        })
      },
    },
  ],

  // COMMANDS FOR THE OPERATOR

  operatorCommands: Ember.computed(function(){
    return this.get('sharedCommands').concat([
      {
        command: "whoami",
        options: [],
        desc: "prints information on the currently logged in user",
        run: (data)=>{
          let user = this.get('user')
          data.readOut.pushObject(`${data.currNode} ${data.command}`)
          data.readOut.pushObject(`USER = ${user}`)
          data.readOut.pushObject(`ROLE = engineer`)
          data.readOut.pushObject(`PASSWORD = ${data.operatorPassword}`)
        }
      },
      {
        command: "whereami",
        options: [],
        desc: "prints out information on the server's confirmation",
        run: (data)=>{
          data.readOut.pushObject(`${data.currNode} ${data.command}`);
          data.readOut.pushObject(`LOCATION = engineering`);
          data.readOut.pushObject(`SERVER PORT = ${data.serverPort}`);
        }
      }
    ])
  }),

  //OPERATIVE COMMANDS

  operativeCommands: Ember.computed(function(){
    return this.get('sharedCommands').concat([
      {
        command: `door`,
        options: [
          `--open [password] : opens the door with supplied password`,
          `--init : initializes the door's connection to the console, requires server connection to console`,
          `--code : prints the code for the door, base64 encoded`
        ],
        desc: "access the door's operations, type door --help to get a list of options",
        run: (data)=>{
          data.readOut.pushObject(`${data.currNode} ${data.command}`)
          let operation = data.commandList.filter((e)=>{
            return e.command == data.command
          })[0]
          switch (data.option) {
            case "--open":
              if (data.optionParams[0] === data.operatorPassword) {
                data.readOut.pushObject('DOOR HAS OPENED YOU WIN!')
                return true;
              } else {
                data.readOut.pushObject("error: incorrect password")
              }
              break;
            case "--init":

              break;
            case "--code":

              break;
            case "--help":
              operation.options.forEach((e)=>{
                data.readOut.pushObject(e)
              })
              break;
            case undefined:
                data.readOut.pushObject(`error: No option supplied, type --help to get a list of options and their descriptions`)
              break;
            default:

          }
        }
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
