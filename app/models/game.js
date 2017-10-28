import DS from 'ember-data';

export default DS.Model.extend({
  owner: DS.attr('string'),
  ownerRole: DS.attr('string'),
  publicRoom: DS.attr('boolean'),
  timestamp: DS.attr('number'),
  operatorPassword: DS.attr('string'),
  operatorPort: DS.attr('string'),
  operativePort: DS.attr('string'),
  operativeLocation: DS.attr('string'),
});
