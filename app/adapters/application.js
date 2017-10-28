import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'https://lock-down-web-server.herokuapp.com',
  namespace: 'api/v1',
  createRecord(store, type, snapshot){
    let data = this.serialize(snapshot, {includeId: false})

    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'POST',
        url: `${ENV.apihost}/${ENV.namespace}/${type.modelName}s`,
        dataType: 'json',
        data: data
      }).then(function(data){
        Ember.run(null, resolve, data);
      }, function(jqXHR){
        jqXHR.then = null;
        Ember.run(null, reject, jqXHR);
      })
    })
  }
});
