define(function() {

  return Backbone.View.extend({

    events: {

      'click [data-signin]': function(e) {
        e.preventDefault();
        navigator.id.request();
      },

      'click [data-signout]': function(e) {
        e.preventDefault();
        navigator.id.logout();
      }
    },

    initialize: function(options) {
      _.bindAll(this, 'signin', 'signout');

      _.extend(this, _.pick(options, 'email'));

      navigator.id.watch({
        loggedInUser: this.email,
        onlogin: this.signin,
        onlogout: this.signout
      });
    },

    signin: function(assertion) {
      $.ajax({
        type: 'POST',
        url: '/signin',
        data: {assertion: assertion},
        success: function() {
          window.location.reload();
        },
        error: function() {
          navigator.id.logout();
        }
      });
    },

    signout: function() {
      $.ajax({
        type: 'POST',
        url: '/signout',
        success: function() {
          window.location.reload();
        },
        error: function() {
          // TODO
        }
      });
    },

    render: function() {
      return this;
    }

  });

});
