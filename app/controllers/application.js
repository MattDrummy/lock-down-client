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
      this.set('user', "GUEST")
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
      modal.close();
    }
  }
});
