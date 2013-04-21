var Entity = require('./entity');

var User = module.exports = require('./model')({
  name: 'users',
  columns: [
    'id',
    'email',
    'admin'
  ]
});

// Abilities

// Define an ability for a specific model type.
User.can = function(actions, Model, predicate) {
  if (!Array.isArray(actions)) actions = [actions];
  if (!this.cans) this.cans = {};
  actions.forEach(function(action) {
    if (!this.cans[action]) this.cans[action] = [];
    this.cans[action].push({Model: Model, predicate: predicate});
  }, this);
};

// Check for the ability to perform some action on a specific model.
User.prototype.can = function(action, model) {
  var result = false;
  var cans = this.constructor.cans;
  if (!cans || !cans[action]) return false;
  cans[action].forEach(function(can) {
    if (!(model instanceof can.Model)) return;
    if (!can.predicate.call(this, model)) return;
    result = true;
  }, this);
  return result;
};

User.can('edit', Entity, function(entity) {
  return entity && (this.admin || entity.owner_id === this.id);
});
