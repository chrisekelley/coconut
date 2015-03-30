var UsersView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

UsersView = (function(superClass) {
  extend(UsersView, superClass);

  function UsersView() {
    this.render = bind(this.render, this);
    return UsersView.__super__.constructor.apply(this, arguments);
  }

  UsersView.prototype.initialize = function() {
    return this.userCollection = new UserCollection();
  };

  UsersView.prototype.el = '#content';

  UsersView.prototype.events = {
    "submit form#user": "save",
    "click .loadUser": "load"
  };

  UsersView.prototype.save = function() {
    var user, userData;
    userData = $('#user').toObject({
      skipEmpty: false
    });
    userData._id = "user." + userData._id;
    user = new User({
      _id: userData._id
    });
    console.log(userData);
    user.fetch({
      success: (function(_this) {
        return function() {
          return user.save(userData, {
            success: function() {
              return _this.render();
            }
          });
        };
      })(this),
      error: (function(_this) {
        return function() {
          return user.save(userData, {
            success: function() {
              return _this.render();
            }
          });
        };
      })(this)
    });
    return false;
  };

  UsersView.prototype.load = function(event) {
    var user;
    user = new User({
      _id: $(event.target).closest("a").attr("data-user-id")
    });
    user.fetch({
      success: (function(_this) {
        return function() {
          user.set({
            _id: user.get("_id").replace(/user\./, "")
          });
          return js2form($('#user').get(0), user.toJSON());
        };
      })(this)
    });
    return false;
  };

  UsersView.prototype.render = function() {
    var fields;
    fields = "_id,password,district,name,comments".split(",");
    this.$el.html("<h2>Create/edit users</h2> <h3>Use phone number for username to enable SMS messages</h3> <form id='user'> " + (_.map(fields, function(field) {
      return "<label style='display:block' for='" + field + "'>" + (field === "_id" ? "Username" : field.humanize()) + "</label> <input id='" + field + "' name='" + field + "' type='text'></input>";
    }).join("")) + " <input type='submit'></input> </form> <h2>Click username to edit</h2> <table> <thead> " + (_.map(fields, function(field) {
      return "<th>" + (field === "_id" ? "Username" : field.humanize()) + "</th>";
    }).join("")) + " </thead> <tbody> </tbody> </table>");
    this.userCollection.fetch({
      success: (function(_this) {
        return function() {
          _this.userCollection.sortBy(function(user) {
            return user.get("_id");
          }).forEach(function(user) {
            return $("tbody").append("<tr> " + (_.map(fields, function(field) {
              var data;
              data = user.get(field);
              if (field === "_id") {
                return "<td><a class='loadUser' data-user-id='" + (user.get("_id")) + "' href=''>" + (data.replace(/user\./, "")) + "</a></td>";
              } else {
                return "<td>" + data + "</td>";
              }
            }).join("")) + " </tr>");
          });
          return $("a").button();
        };
      })(this)
    });
    $('table').addTableFilter({
      labelText: null
    });
    return $("input[type=search]").textinput();
  };

  return UsersView;

})(Backbone.View);
