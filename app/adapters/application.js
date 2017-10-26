import DS from 'ember-data';
import ENV from 'lock-down-client/config/environment';
export default DS.RESTAdapter.extend({
  host: ENV.apiHost,
  namespace: 'api/v1',
  createRecord(store, type, snapshot){
    let data = this.serialize(snapshot, {includeId: false})

    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'POST',
        url: `${ENV.apiHost}/api/v1/${type.modelName}s`,
        dataType: 'json',
        data: data
      }).then(function(data){
        Ember.run(null, resolve, data);
      }, function(jqXHR){
        let data = JSON.parse(jqXHR.responseText);
        Ember.run(null, reject, data);
      })
    })
  }
});
