import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('lobby-chat-box', 'Integration | Component | lobby chat box', {
  integration: true
});

test('it renders', function(assert) {
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{lobby-chat-box}}`);

  // assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#lobby-chat-box}}
      template block text
    {{/lobby-chat-box}}
  `);

  // assert.equal(this.$().text().trim(), 'template block text');

  assert.ok(true)
});
