var User, UserCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

User = (function(superClass) {
  extend(User, superClass);

  function User() {
    return User.__super__.constructor.apply(this, arguments);
  }

  User.prototype.url = "/user";

  User.prototype.username = function() {
    return this.get("_id").replace(/^user\./, "");
  };

  User.prototype.passwordIsValid = function(password) {
    return this.get("password") === password;
  };

  User.prototype.isAdmin = function() {
    return this.username() === "admin";
  };

  User.prototype.login = function() {
    $.cookie('current_user', this.username());
    $("#user").html(this.username());
    $('#district').html(this.get("district"));
    $("a[href=#logout]").show();
    $("a[href=#login]").hide();
    if (this.isAdmin()) {
      $("#manage-button").show();
    } else {
      $("#manage-button").hide();
    }
    return User.currentUser = this;
  };

  User.prototype.refreshLogin = function() {
    return this.login();
  };

  return User;

})(Backbone.Model);

User.isAuthenticated = function(options) {
  var user;
  user = new User({
    _id: "user.admin"
  });
  return user.fetch({
    success: function() {
      user.refreshLogin();
      return options.success(user);
    },
    error: function() {
      return options.error();
    }
  });
};

User.logout = function() {
  $.cookie('current_user', "");
  $("#user").html("");
  $('#district').html("");
  $("a[href=#logout]").hide();
  $("a[href=#login]").show();
  return User.currentUser = null;
};

UserCollection = (function(superClass) {
  extend(UserCollection, superClass);

  function UserCollection() {
    return UserCollection.__super__.constructor.apply(this, arguments);
  }

  UserCollection.prototype.model = User;

  UserCollection.prototype.url = '/user';

  return UserCollection;

})(Backbone.Collection);
