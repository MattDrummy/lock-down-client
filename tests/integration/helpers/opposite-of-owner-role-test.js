
import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('opposite-of-owner-role', 'helper:opposite-of-owner-role', {
  integration: true
});

// Replace this with your real tests.
test('it renders', function(assert) {
  this.set('inputValue', '1234');

  this.render(hbs`{{opposite-of-owner-role inputValue}}`);

  assert.ok(true);
});
