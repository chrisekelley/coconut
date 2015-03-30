var Translation,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Translation = (function(superClass) {
  extend(Translation, superClass);

  function Translation() {
    return Translation.__super__.constructor.apply(this, arguments);
  }

  Translation.prototype.url = "/translation";

  Translation.prototype.toJSON = function() {
    var json;
    json = Translation.__super__.toJSON.call(this);
    return json;
  };

  return Translation;

})(Backbone.Model);
