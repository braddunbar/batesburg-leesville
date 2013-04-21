
var Entity = module.exports = require('./model')({
  name: 'entities',
  columns: [
    'id',
    'name',
    'owner_id',
    'description',
    'phone',
    'tags',
    'street',
    'city',
    'state',
    'zip'
  ]
});

Entity.prototype.url = function() {
  return '/entities/' + this.id + '/' + encodeURIComponent(this.name);
};

Entity.prototype.hasLocation = function() {
  return this.street && this.city && this.state && this.zip;
};
