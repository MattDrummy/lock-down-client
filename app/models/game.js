import DS from 'ember-data';

export default DS.Model.extend({
  owner: DS.attr('string'),
  ownerrole: DS.attr('string'),
  publicroom: DS.attr('boolean'),
  operatorpassword: DS.attr('string'),
  operatorport: DS.attr('string'),
  operativeport: DS.attr('string'),
  operativelocation: DS.attr('string'),
  timestamp: DS.attr('number'),

});
