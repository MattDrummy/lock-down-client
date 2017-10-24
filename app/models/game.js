import DS from 'ember-data';

export default DS.Model.extend({
  owner: DS.attr('string'),
  room: DS.attr('string'),
  operator: DS.attr('string'),
  operative: DS.attr('string'),
  password: DS.attr('string'),
  timestamp: DS.attr('timestamp'),
});
