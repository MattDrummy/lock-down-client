import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'http://localhost:7000',
  namespace: 'api/v1',
  createRecord(store, type, snapshot){
    let data = this.serialize(snapshot, {includeId: false})
    let host = this.get('host');
    let namespace = this.get('namespace')
    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'POST',
        url: `${host}/${namespace}/${type.modelName}s`,
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
