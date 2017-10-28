import Ember from 'ember';
import DS from 'ember-data';
import ENV from 'lock-down-client/config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.API_HOST,
  namespace: ENV.NAMESPACE,
  createRecord(store, type, snapshot){
    let data = this.serialize(snapshot, {includeId: false})

    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'POST',
        url: `${this.host}/${this.namespace}/${type.modelName}s`,
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
