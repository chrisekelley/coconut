var Help,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Help = (function(superClass) {
  extend(Help, superClass);

  function Help() {
    return Help.__super__.constructor.apply(this, arguments);
  }

  Help.prototype.initialize = function() {};

  Help.prototype.url = "/help";

  return Help;

})(Backbone.Model);
