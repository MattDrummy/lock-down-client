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
