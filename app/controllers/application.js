import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: false,
  user: Ember.computed(()=>{
    if (localStorage.user) {
      return localStorage.user
    } else {
      return `guest${Math.ceil(Math.random()*8999 + 1000)}`
    }
  }),
  userEmail: "test@example.no",
  userTimestamp: "",
  logInUsername: "",
  logInPassword: "",
  signUpUsername: "",
  signUpEmail: "",
  signUpPassword: "",
  editUsername: "",
  editEmail: "",
  editPassword: "",
  socketIOService: Ember.inject.service('socket-io'),
  url: `https://lock-down-web-server.herokuapp.com`,
  init(){
    if (localStorage.token) {
      let c = this;
      Ember.$.ajax({
        type: 'POST',
        url: `${c.get('url')}/verifyToken`,
        datatype: 'json',
        data: {
          tokenString: localStorage.token,
        }
      }).then((user)=>{
        localStorage.user = user.claims.username
        c.set('user', user.claims.username);
        c.set('userEmail', user.claims.email);
        c.set('userTimestamp', user.claims.timestamp);
        c.set('loggedIn', true);
      })
    }
  },

  // ACTIONS

  actions: {
    logIn(modal){
      let c = this
      let username = c.get('logInUsername');
      let password = c.get('logInPassword');

      c.get('store').findAll('user')
      .then((data)=>{
        let dbUser = data.content.map((item)=>{
          return item.__data;
        }).filter((item)=>{
          return item.username == username;
        })[0]

          // SIGN JWT AFTER VERIFIYING IDENTITY

          Ember.$.ajax({
            type: 'POST',
            url: `${c.get('url')}/logIn`,
            dataType: 'json',
            data: {
              password: password,
              timestamp: dbUser.timestamp,
            },
          })
          .then((response)=>{
            localStorage.user = dbUser.username;
            localStorage.token = response.tokenString;
            c.set('user', dbUser.username);
            c.set('userEmail', dbUser.email);
            c.set('userTimestamp', dbUser.timestamp);
            c.set('loggedIn', true);

          })
          .catch((err)=>{
            alert(err.responseJSON.error)
          })
      })
      modal.close()
    },
    logOut(){
      let c = this;
      c.set('loggedIn', false);
      let user = `guest${Math.ceil(Math.random()*8999) + 1000}`;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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
          localStorage.user = user.username;
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
      c.set('editEmail', "");
      c.set('editUsername', "");
      c.set('editPassword', "");
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
        localStorage.removeItem('user');
        c.set('user', user);
        c.set('userEmail', email);
        c.transitionToRoute('index');
        modal.close();

      })
    },
    editUser(modal){
      let c = this;
      let timestamp = c.get('userTimestamp');
      c.get('store').queryRecord('user', {
        "timestamp": timestamp,
      })
      .then((data)=>{
        let username = c.get('editUsername');
        let email = c.get('editEmail');
        let password = c.get('editPassword');
        if (username != "") {
          data.set('username', username );
        }
        if (email != "") {
          data.set('email', email );
        }
        if (password != "") {
          data.set('password', password );
        }
        return data.save()
      })
      .then((response)=>response._internalModel.__data)
      .then((user)=>{
        localStorage.user = user.username;
        c.set('user', user.username);
        c.set('userEmail', user.email);
        c.set('userTimestamp', user.timestamp);
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
          c.set('editEmail', "");
          c.set('editUsername', "");
          c.set('editPassword', "");
          modal.close();
        })
        .catch((err)=>{
          alert(err.responseJSON.error);
        })
      })
    }
  }
});
