var LoginView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

LoginView = (function(superClass) {
  extend(LoginView, superClass);

  function LoginView() {
    this.render = bind(this.render, this);
    return LoginView.__super__.constructor.apply(this, arguments);
  }

  LoginView.prototype.el = '#content';

  LoginView.prototype.render = function() {
    return this.$el.html("<style> #login_wrapper{ font-size: 200%; width:50%; margin: 0px auto; } #login_message{ margin-top: 20px; margin-bottom: 20px; } #login_form input{ font-size: 100%; display: block; } #login_form input[type=submit]{ height: 2em; } </style> <div id='login_wrapper'> <div id='login_message'>Please login to continue:</div> <form id='login_form'> <label for='username'>Username</label> <input type='text' id='username' name='username'> <label for='password'>Password</label> <input id='password' name='password' type='password'> <input type='submit' value='Login'> </form> </div>");
  };

  LoginView.prototype.events = {
    "submit form#login_form": "login"
  };

  LoginView.prototype.updateNavBar = function() {};

  LoginView.prototype.login = function() {
    var loginData, user;
    loginData = $('#login_form').toObject();
    user = new User({
      _id: "user." + loginData.username
    });
    user.fetch({
      success: (function(_this) {
        return function() {
          if (user.passwordIsValid(loginData.password)) {
            user.login();
            return _this.callback.success();
          } else {
            return $('#login_message').html("Wrong password");
          }
        };
      })(this),
      error: (function(_this) {
        return function() {
          return $('#login_message').html("Wrong username");
        };
      })(this)
    });
    return false;
  };

  return LoginView;

})(Backbone.View);
