import Ember from 'ember';

export function oppositeOfOwnerRole(ownerRole/*, hash*/) {
  return ownerRole == "operator" ? "operative" : "operator"
}

export default Ember.Helper.helper(oppositeOfOwnerRole);
