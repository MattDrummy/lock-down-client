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
  },
  findRecord(store, type, id){
    let host = this.get('host')
    let namespace = this.get('namespace')
    let timestamp = id;
    return new Ember.RSVP.Promise(function(resolve,reject){
      Ember.$.getJSON(`${host}/${namespace}/${type.modelName}s/${timestamp}`)
        .then(function(data){
          resolve(data)
        },function(jqXHR){
          reject(jqXHR)
        })
    })
  },
  deleteRecord(store,type,snapshot){
    let data = this.serialize(snapshot,{includeId: false})
    let timestamp = snapshot._attributes.timestamp;
    let host = this.get('host')
    let namespace = this.get('namespace')

    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'DELETE',
        url: `${host}/${namespace}/${type.modelName}s/${timestamp}`,
        dataType: `json`,
        data: data,
      }).then(function(data){
        Ember.run(null, resolve, data);
      }, function(err){
        err.then = null;
        Ember.run(null, reject, err)
      })
    })
  }
});
