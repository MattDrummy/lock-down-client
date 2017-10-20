import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: true,
  user: "GUEST",
  actions: {
    logIn(){
      this.set('loggedIn', true);
    },
    logOut(){
      this.set('loggedIn', false);
    },
    signUp(){

    },
  }
});
