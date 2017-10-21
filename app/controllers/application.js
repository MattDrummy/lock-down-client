import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: false,
  user: "GUEST",
  signUpUsername: "",
  signUpEmail: "",
  signUpPassword: "",
  actions: {
    logIn(){
      this.set('loggedIn', true);
    },
    logOut(){
      this.set('loggedIn', false);
    },
    signUp(){
      this.set("user", this.get("signUpUsername"))
    }
  }
});
