import Ember from 'ember';
import DS from 'ember-data';

export default DS.RESTAdapter.extend({
  host: 'http://localhost:7000',
  namespace: 'api/v1',
  shouldReloadRecord: function() {
    return true;
  },
  shouldReloadAll: function() {
    return true;
  },
  shouldBackgroundReloadRecord: function() {
    return true;
  },
  shouldBackgroundReloadAll: function() {
    return true;
  },
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
  findAll(store, type, sinceToken){
    let query = { since: sinceToken };
    let host = this.get('host')
    let namespace = this.get('namespace')

    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.getJSON(`${host}/${namespace}/${type.modelName}s`, query).then(function(data){
        resolve(data)
      }, function(err){
        reject(err)
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
    let data = this.serialize(snapshot, {includeId: false})
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
  },
  updateRecord(store, type, snapshot){
    let data = this.serialize(snapshot, {includeId: false})
    let timestamp = snapshot._attributes.timestamp;
    let host = this.get('host')
    let namespace = this.get('namespace')
    return new Ember.RSVP.Promise(function(resolve, reject){
      Ember.$.ajax({
        type: 'PUT',
        url: `${host}/${namespace}/${type.modelName}s/${timestamp}`,
        dataType: `json`,
        data: data,
      }).then(function(data){
        Ember.run(null, resolve, data)
      }, function(err){
        err.then = null;
        Ember.run(null, reject, err);
      })
    })
  },
});
