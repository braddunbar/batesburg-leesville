
var Entity = module.exports = require('./model')({
  name: 'entities',
  columns: [
    'id',
    'name',
    'owner_id',
    'description',
    'phone',
    'tags'
  ]
});

Entity.prototype.url = function() {
  return '/entities/' + this.id + '/' + encodeURIComponent(this.name);
};
