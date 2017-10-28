import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: false,
  user: `guest${Math.ceil(Math.random()*8999 + 1000)}`,
  userEmail: "test@example.no",
  logInUsername: "",
  logInPassword: "",
  signUpUsername: "",
  signUpEmail: "",
  signUpPassword: "",
  socketIOService: Ember.inject.service('socket-io'),
  url: `http://localhost:7000`,

  // COMMANDS SHARED BY BOTH USERS

  sharedCommands: [
    {
      command: "--help",
      options: [],
      desc: "lists commands and options for given command, or lists all commands if given on its own.",
      run: (data)=>{
        data.readOut.pushObject(`${data.currPath} ${data.command}`)
        data.commandList.forEach((e)=>{
          data.readOut.pushObject(`${e.command} : ${e.desc}`);
        })
      },
    },
    {
      command: "whereami",
      options: [],
      desc: "prints out information on the server's confirmation",
      run: (data)=>{
        data.readOut.pushObject(`${data.currPath} ${data.command}`);
        data.readOut.pushObject(`LOCATION = ${data.currLocation}`);
        data.readOut.pushObject(`PORT = ${data.port}`);
      }
    },

  ],

  // OPERATOR COMMANDS

  operatorCommands: Ember.computed(function(){
    return this.get('sharedCommands').concat([
      {
        command: "whoami",
        options: [],
        desc: "prints information on the currently logged in user",
        run: (data)=>{
          let user = this.get('user')
          data.readOut.pushObject(`${data.currPath} ${data.command}`)
          data.readOut.pushObject(`USER = ${user}`)
          data.readOut.pushObject(`ROLE = engineer`)
          data.readOut.pushObject(`PASSWORD = ${data.operatorPassword}`)
        }
      },
    ])
  }),

  //OPERATIVE COMMANDS

  operativeCommands: Ember.computed(function(){
    return this.get('sharedCommands').concat([
      {
        command: `door`,
        options: [
          `--open [password] : opens the door with supplied password`,
        ],
        desc: "access the door's operations, type door --help to get a list of options",
        run: (data)=>{
          data.readOut.pushObject(`${data.currPath} ${data.command}`)
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

  // FILE STRUCTURE FOR OPERATOR


  operatorFileStructure: Ember.computed(()=>{
    return {
      path: "C://",
      bin: {
        path: "C://bin",
      },
      log: {
        path: "C://log",
      },
    }
  }),

  // FILE STRUCTURE FOR OPERATIVE

  operativeFileStructure: Ember.computed(()=>{
    return {
      path: "C://",
      bin: {
        path: "C://bin",
      },
      log: {
        path: "C://log",
      },
    }
  }),

  // ACTIONS

  actions: {
    logIn(modal){
      modal.close()
    },
    logOut(){
      this.set('loggedIn', false);
      let user = `guest${Math.ceil(Math.random()*8999) + 1000}`;
      let email = user + "@example.com"
      localStorage.user = user;
      localStorage.email = email
      localStorage.removeItem('token');
      this.set('user', user);
      this.set('userEmail', email);
      this.transitionToRoute('index');
    },
    signUp(modal){
      let username = this.get('signUpUsername');
      let email = this.get('signUpEmail');
      let password = this.get('signUpPassword');
      let post = this.get('store').createRecord('user', {
        username, email, password,
      })
        post.save().then((response)=>response._internalModel.__data)
          .then((user)=>{
            localStorage.user = user.username;
            localStorage.email = user.email;
            localStorage.timestamp = user.timestamp;
            this.set('user', user.username);
            this.set('userEmail', user.email);
            this.set('userTimestamp', user.timestamp);
            this.set('loggedIn', true);
            this.set('signUpUsername', '');
            this.set('signUpEmail', '');
            this.set('signUpPassword', '');
            modal.close()
          })
          .catch((err)=>{
            alert(err.responseJSON.error)
          })
    },
    closeModal(modal){
      this.set('signUpUsername', '');
      this.set('signUpEmail', '');
      this.set('signUpPassword', '');
      this.set('logInPassword', "");
      this.set('logInUsername', "");
      modal.close();
    },
    deleteUser(modal){
      let timestamp = this.get('userTimestamp');
      this.set('loggedIn', false);
      let user = `guest${Math.ceil(Math.random()*8999) + 1000}`;
      let email = user + "@example.com"
      localStorage.user = user;
      localStorage.email = email
      localStorage.removeItem('token');
      this.set('user', user);
      this.set('userEmail', email);
      this.transitionToRoute('index');
      this.get('store').queryRecord('user', {"timestamp": timestamp})
        .then(function(user){
          user.deleteRecord();
          user.save();
          modal.close();
        })
    }
  }
});
