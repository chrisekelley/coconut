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
    var coconut_version, district, timestamp, username;
    if (typeof Coconut.currentAdmin !== 'undefined' && Coconut.currentAdmin !== null) {
      username = Coconut.currentAdmin.id;
    }
    timestamp = moment(new Date()).format(Coconut.config.get("datetime_format"));
    if (Coconut.version_code !== 'undefined') {
      coconut_version = Coconut.version_code;
    }
    if (Coconut.currentDistrict !== null) {
      district = Coconut.currentDistrict;
    }
    return this.set({
      username: username,
      district: district,
      timestamp: timestamp,
      model: device.model,
      platform: device.platform,
      deviceUuid: device.uuid,
      cordova: device.cordova,
      android_version: device.version,
      coconut_version: coconut_version,
      collection: "Log"
    });
  };

  Log.prototype.url = "/Log";

  Log.prototype.save = function(message, options) {
    return Log.__super__.save.call(this, message, options);
  };

  return Log;

})(Backbone.Model);
