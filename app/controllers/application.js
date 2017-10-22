import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: false,
  user: "",
  logInUsername: "",
  logInPassword: "",
  signUpUsername: "",
  signUpEmail: "",
  signUpPassword: "",
  actions: {
    logIn(){
      this.set('user', this.get('logInUsername'))
      this.set('logInPassword', "")
      this.set('logInUsername', "")
      this.set('loggedIn', true);
    },
    logOut(){
      this.set('loggedIn', false);
      this.set('user', "GUEST")
    },
    signUp(){
      this.set("user", this.get("signUpUsername"))
      this.set('signUpUsername', '');
      this.set('signUpEmail', '');
      this.set('signUpPassword', '')
      this.set('loggedIn', true);

    }
  }
});
