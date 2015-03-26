var Log,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Log = (function(superClass) {
  extend(Log, superClass);

  function Log() {
    return Log.__super__.constructor.apply(this, arguments);
  }

  Log.prototype.initialize = function() {
    username;
    var timestamp, username;
    if (typeof Coconut.currentAdmin !== 'undefined' && Coconut.currentAdmin !== null) {
      username = Coconut.currentAdmin.id;
    }
    timestamp = moment(new Date()).format(Coconut.config.get("datetime_format"));
    return this.set({
      username: username,
      timestamp: timestamp,
      cordova: device.cordova,
      model: device.model,
      platform: device.platform,
      uuid: device.uuid,
      version: device.version,
      collection: "log"
    });
  };

  Log.prototype.url = "/log";

  Log.prototype.save = function(message, options) {
    return Log.__super__.save.call(this, message, options);
  };

  return Log;

})(Backbone.Model);
