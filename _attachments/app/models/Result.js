var Result,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Result = (function(_super) {

  __extends(Result, _super);

  function Result() {
    Result.__super__.constructor.apply(this, arguments);
  }

  Result.prototype.url = "/result";

  Result.prototype.question = function() {
    return this.get("question");
  };

  Result.prototype.tags = function() {
    var tags;
    tags = this.get("tags");
    if (tags != null) return tags.split(/, */);
    return [];
  };

  Result.prototype.complete = function() {
    return _.include(this.tags(), "complete");
  };

  Result.prototype.shortString = function() {
    var result;
    result = this.string;
    if (result.length > 40) {
      return result.substring(0, 40) + "...";
    } else {
      return result;
    }
  };

  return Result;

})(Backbone.Model);
