
var User = module.exports = require('./model')({
  name: 'entities',
  columns: [
    'id',
    'name',
    'owner_id'
  ]
});
