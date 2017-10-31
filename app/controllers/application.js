import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: false,
  user: `guest${Math.ceil(Math.random()*8999 + 1000)}`,
  userEmail: "test@example.no",
  userTimestamp: "",
  logInUsername: "",
  logInPassword: "",
  signUpUsername: "",
  signUpEmail: "",
  signUpPassword: "",
  editUsername: undefined,
  editEmail: undefined,
  editPassword: undefined,
  socketIOService: Ember.inject.service('socket-io'),
  url: `http://localhost:7000`,
  init(){
    if (localStorage.token) {
      let c = this;
      Ember.$.ajax({
        type: 'POST',
        url: `${c.get('url')}/logIn`,
        datatype: 'json',
        data: {
          tokenString: localStorage.token,
        }
      }).then((user)=>{
        c.set('user', user.claims.username);
        c.set('userEmail', user.claims.email);
        c.set('userTimestamp', user.claims.timestamp);
        c.set('loggedIn', true);
      })
    }
  },
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
    let c = this;
    return c.get('sharedCommands').concat([
      {
        command: "whoami",
        options: [],
        desc: "prints information on the currently logged in user",
        run: (data)=>{
          let user = c.get('user')
          data.readOut.pushObject(`${data.currPath} ${data.command}`)
          data.readOut.pushObject(`USER = ${user}`)
          data.readOut.pushObject(`ROLE = engineer`)
          data.readOut.pushObject(`PASSWORD = ${data.operatorpassword}`)
        }
      },
    ])
  }),

  //OPERATIVE COMMANDS

  operativeCommands: Ember.computed(function(){
    let c = this;
    return c.get('sharedCommands').concat([
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
              if (data.optionParams[0] === data.operatorpassword) {
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
      let c = this
      let username = c.get('logInUsername')
      let password = c.get('logInPassword')
      c.get('store').findAll('user')
      .then((data)=>{
        let user = data.content.map((item)=>{
          return item.__data;
        }).filter((item)=>{
          return item.username == username;
        })[0]
        if (user.password == password) {
          c.set('user', user.username);
          c.set('userEmail', user.email);
          c.set('userTimestamp', user.timestamp);
          c.set('loggedIn', true);

          Ember.$.ajax({
            type: 'POST',
            url: `${c.get('url')}/signJWT`,
            dataType: 'json',
            data: {
              username: user.username,
              email: user.email,
              password: user.password,
              timestamp: user.timestamp,
            },
          })
          .then((response)=>{
            localStorage.token = response.tokenString;
          })
          .catch((err)=>{
            alert(err.responseJSON.error);
          })
        } else{
          alert('password is incorrect! Please try again.')
        }
      })
      modal.close()
    },
    logOut(){
      let c = this;
      c.set('loggedIn', false);
      let user = `guest${Math.ceil(Math.random()*8999) + 1000}`;
      localStorage.removeItem('token');
      c.set('user', user);
      location.href = "/"
    },
    signUp(modal){
      let c = this
      let username = c.get('signUpUsername');
      let email = c.get('signUpEmail');
      let password = c.get('signUpPassword');
      let post = c.get('store').createRecord('user', {
        username, email, password,
      })
      post.save()
      .then((response)=>response._internalModel.__data)
      .then((user)=>{
        let sign = {
          username: user.username,
          email: user.email,
          password: user.password,
          timestamp: user.timestamp,
        }
        Ember.$.ajax({
          type: 'POST',
          url: `${c.get('url')}/signJWT`,
          dataType: 'json',
          data: sign,
        })
        .then((data)=>{
          c.set('user', user.username);
          c.set('userEmail', user.email);
          c.set('userTimestamp', user.timestamp);
          c.set('loggedIn', true);
          c.set('signUpUsername', '');
          c.set('signUpEmail', '');
          c.set('signUpPassword', '');
          localStorage.token = data.tokenString;
          modal.close()
        })
      })
      .catch((err)=>{
        alert(err.responseJSON.error)
      })
    },
    closeModal(modal){
      let c = this
      c.set('signUpUsername', '');
      c.set('signUpEmail', '');
      c.set('signUpPassword', '');
      c.set('logInPassword', "");
      c.set('logInUsername', "");
      modal.close();
    },
    deleteUser(modal){
      let c = this;
      let timestamp = c.get('userTimestamp');
      c.get('store').queryRecord('user', {"timestamp": timestamp})
      .then((user)=>{
        user.deleteRecord();
        return user.save();
      })
      .then(()=>{
        c.set('loggedIn', false);
        let user = `guest${Math.ceil(Math.random()*8999) + 1000}`;
        let email = user + "@example.com"
        localStorage.removeItem('token');
        c.set('user', user);
        c.set('userEmail', email);
        c.transitionToRoute('index');
        modal.close();

      })
    },
    editUser(modal){
      let c = this;
      let username = c.get('editUsername');
      let email = c.get('editEmail');
      let password = c.get('editPassword');
      let timestamp = c.get('userTimestamp');
      c.get('store').queryRecord('user', {
        "timestamp": timestamp,
      })
      .then((data)=>{
        let user = data._internalModel.__data;
        data.set('username', username != "" ? username : user.username );
        data.set('email', email != "" ? email : user.email );
        data.set('password', password != "" ? password : user.password );
        return data.save()
      })
      .then((response)=>response._internalModel.__data)
      .then((user)=>{
        c.set('user', user.username);
        c.set('userEmail', user.email);
        c.set('userTimestamp', user.timestamp);
        c.set('editEmail', "");
        c.set('editUsername', "");
        c.set('editPassword', "");
        modal.close();
      })
    }
  }
});
