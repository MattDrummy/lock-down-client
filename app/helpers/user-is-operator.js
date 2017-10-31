import Ember from 'ember';

export function userIsOperator(role/*, hash*/) {
  return role == "operator";
}

export default Ember.Helper.helper(userIsOperator);
