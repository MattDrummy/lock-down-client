import Ember from 'ember';

export function oppositeOfownerrole(ownerrole/*, hash*/) {
  return ownerrole == "operator" ? "operative" : "operator"
}

export default Ember.Helper.helper(oppositeOfownerrole);
