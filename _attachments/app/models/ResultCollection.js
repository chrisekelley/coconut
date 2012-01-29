var ResultCollection;
var __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
ResultCollection = (function() {
  __extends(ResultCollection, Backbone.Collection);
  function ResultCollection() {
    ResultCollection.__super__.constructor.apply(this, arguments);
  }
  ResultCollection.prototype.model = Result;
  ResultCollection.prototype.url = '/result';
  ResultCollection.prototype.filteredByQuestionCategorizedByStatus = function(questionType) {
    var returnObject;
    returnObject = {};
    returnObject.complete = [];
    returnObject.notCompete = [];
    this.each(function(result) {
      if (result.get("question") !== questionType) {
        return;
      }
      switch (result.get("complete")) {
        case true:
          return returnObject.complete.push(result);
        default:
          return returnObject.notComplete.push(result);
      }
    });
    return returnObject;
  };
  ResultCollection.prototype.filterByQuestionType = function(questionType) {
    return this.filter(function(result) {
      return result.get("question") === questionType;
    });
  };
  return ResultCollection;
})();