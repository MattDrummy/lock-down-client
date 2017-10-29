import Ember from 'ember';

export default Ember.Route.extend({
  model(params){
    return {
      games: this.get('store').findAll('game'),
      role: params.role,
      timestamp: params.timestamp
    }
  },
});
