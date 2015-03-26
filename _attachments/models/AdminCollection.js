var AdminCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

AdminCollection = (function(superClass) {
  extend(AdminCollection, superClass);

  function AdminCollection() {
    return AdminCollection.__super__.constructor.apply(this, arguments);
  }

  AdminCollection.prototype.model = Result;

  AdminCollection.prototype.url = '/result';

  AdminCollection.prototype.parse = function(result) {
    var docs;
    docs = _.pluck(result.rows, 'doc');
    return docs;
  };

  return AdminCollection;

})(Backbone.Collection);
