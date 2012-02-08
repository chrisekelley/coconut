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
    var question;
    question = new Question({
      id: this.question()
    });
    return question.fetch({
      success: __bind(function() {
        var relevantKeys;
        relevantKeys = [];
        if (question.get("resultSummaryFields") != null) {
          relevantKeys = _.keys(question.get("resultSummaryFields"));
          relevantKeys = _.map(relevantKeys, function(key) {
            return key.replace(/[^a-zA-Z0-9 -]/g, "").replace(/[ -]/g, "");
          });
        } else {
          relevantKeys = _.difference(_.keys(this.toJSON()), ["_id", "_rev", "complete", "question", "collection"]);
        }
        return _.map(relevantKeys, __bind(function(key) {
          var result;
          console.log(key);
          console.log(this.get(key));
          result = this.get(key) || "";
          if (typeof result === "object") {
            result = JSON.stringify(result);
          }
          return result;
        }, this)).join(" | ");
      }, this)
    });
  };
  Result.prototype.toShortString = function() {
    var result;
    result = this.toString();
    if (result.length > 40) {
      return result.substring(0, 40) + "...";
    } else {
      return result;
    }
  };
  return Result;
})();