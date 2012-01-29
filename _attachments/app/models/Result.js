var Result;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
}, __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };
Result = (function() {
  __extends(Result, Backbone.Model);
  function Result() {
    Result.__super__.constructor.apply(this, arguments);
  }
  Result.prototype.url = "/result";
  Result.prototype.question = function() {
    return this.get("question");
  };
  Result.prototype.toString = function() {
    var relevantKeys;
    relevantKeys = _.difference(_.keys(this.toJSON()), ["_id", "_rev", "complete", "question", "collection"]);
    return _.map(relevantKeys, __bind(function(key) {
      return this.get(key);
    }, this)).join(" | ");
  };
  Result.prototype.toShortString = function() {
    var result;
    result = this.toString();
    if (result.length > 20) {
      return result.substring(0, 20) + "...";
    } else {
      return result;
    }
  };
  return Result;
})();