var express = require('express');
var app = express();

// Configuration
app.configure(function() {

  // Views
  app.engine('html', require('./engine'));
  app.set('view engine', 'html');
  app.set('layout', 'views/layouts/default.html');

  // Middleware
  app.use(express.compress());
  app.use(express.static('public'));
  app.use(express.bodyParser());
  app.use(express.cookieParser(process.env.SECRET));
  app.use(express.cookieSession());
  app.use(require('./helpers'));
  app.use(require('./helpers/user'));
});

app.get('/', function(req, res) {
  res.render('index');
});

// Authentication
require('./auth')(app);

// Entities
require('./entities')(app);

app.listen(process.env.PORT);
