import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return {
      users: this.get('store').findAll('user'),
      games: this.get('store').findAll('game'),

    }
  }
});
