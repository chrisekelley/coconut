var MessageCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MessageCollection = (function(superClass) {
  extend(MessageCollection, superClass);

  function MessageCollection() {
    return MessageCollection.__super__.constructor.apply(this, arguments);
  }

  MessageCollection.prototype.model = Message;

  MessageCollection.prototype.url = "/message";

  return MessageCollection;

})(Backbone.Collection);
