import Ember from 'ember';

export function isGameOwner(params/*, hash*/) {
  let [user, owner] = params
  return user == owner;
}

export default Ember.Helper.helper(isGameOwner);
