import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    createGame(){
      let form = {
        username: "matt",
        password: "drummy",
        email: "mattdrummy@gmail.com"
      }
      let post = this.get('store').createRecord('user', form)
      post.save();
    }
  }
});
