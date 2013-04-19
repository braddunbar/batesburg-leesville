
var User = module.exports = require('./model')({
  name: 'users',
  columns: [
    'id',
    'email'
  ]
});
