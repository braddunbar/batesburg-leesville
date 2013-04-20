var pg = require('pg');
var sql = require('sql');
var _ = require('underscore');

var DB = process.env.DB;

module.exports = function(config) {

  var Model = function(attributes) {
    _.extend(this, attributes);
  };

  var table = Model.table = Model.prototype.table = sql.define(config);

  Model.query = function(query, next) {

    pg.connect(DB, function(e, client, done) {
      if (e) return next(e);

      query = query.toQuery();
      client.query(query.text, query.values, function(e, result) {
        done();
        if (e) return next(e);
        next(null, result.rows.map(function(row) {
          return new Model(row);
        }));
      });
    });
  };

  var columnNames = _.pluck(table.columns, 'name');

  // Save a model
  Model.prototype.save = function(next) {
    var values = _.omit(_.pick(this, columnNames), 'id');

    // Update if we already have an id.
    if (this.id) {
      var q = table.update(values)
        .where({id: this.id})
        .returning(table.star());
    }

    // Otherwise, insert.
    else {
      var q = table.insert(values).returning(table.star());
    }

    var model = this;
    Model.query(q, function(e, models) {
      if (e) return next(e);
      _.extend(model, _.pick(models[0], columnNames));
      next(null);
    });
  };

  // Column-specific helpers.

  table.columns.forEach(function(column) {
    var name = column.name;
    var Name = name[0].toUpperCase() + name.slice(1);

    // findBy

    Model['findBy' + Name] = function(value, next) {
      var q = table.where(table[name].equals(value));
      Model.query(q, function(e, models) {
        if (e) return next(e);
        next(null, models[0]);
      });
    };

    // findOrCreateBy

    Model['findOrCreateBy' + Name] = function(value, next) {
      var q = table.where(table[name].equals(value));
      Model.query(q, function(e, models) {
        if (e) return next(e);

        // If model exists, return it.
        if (models[0]) return next(null, models[0]);

        // If not, insert it.
        var values = {};
        values[name] = value;
        var insert = table.insert(values).returning(table.star());

        Model.query(insert, function(e, models) {
          if (e) return next(e);
          next(null, models[0]);
        });
      });
    };
  });

  // Alias findById as find
  Model.find = Model.findById;

  return Model;

};
