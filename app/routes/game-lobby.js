import Ember from 'ember';

export default Ember.Route.extend({
  model(){
    return {
      games: this.get('store').findAll('game'),
    }
  }
});
