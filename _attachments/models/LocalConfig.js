var LocalConfig,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

LocalConfig = (function(superClass) {
  extend(LocalConfig, superClass);

  function LocalConfig() {
    return LocalConfig.__super__.constructor.apply(this, arguments);
  }

  LocalConfig.prototype.initialize = function() {
    return this.set({
      _id: "coconut.config.local"
    });
  };

  LocalConfig.prototype.url = "/local_configuration";

  return LocalConfig;

})(Backbone.Model);
