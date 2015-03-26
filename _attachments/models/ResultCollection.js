var ResultCollection,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ResultCollection = (function(superClass) {
  extend(ResultCollection, superClass);

  function ResultCollection() {
    return ResultCollection.__super__.constructor.apply(this, arguments);
  }

  ResultCollection.prototype.model = Result;

  ResultCollection.prototype.url = '/result';

  ResultCollection.prototype.parse = function(result) {
    return _.pluck(result.rows, 'value');
  };

  ResultCollection.prototype.fetch = function(options) {
    if (options == null) {
      options = {};
    }
    if (options.include_docs == null) {
      options.include_docs = true;
    }
    if (options != null ? options.question : void 0) {
      options.descending = "true";
      if (options.isComplete != null) {
        options.startkey = options.question + ":" + options.isComplete + ":z";
        options.endkey = options.question + ":" + options.isComplete;
      } else {
        options.startkey = options.question + ":z";
        options.endkey = options.question;
      }
    }
    return ResultCollection.__super__.fetch.call(this, options);
  };

  ResultCollection.prototype.notSent = function() {
    return this.filter(function(result) {
      var ref;
      return !((ref = result.get("sentTo")) != null ? ref.length : void 0);
    });
  };

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

  ResultCollection.prototype.partialResults = function(questionType) {
    return this.filter(function(result) {
      return result.get("question") === questionType && !result.complete();
    });
  };

  return ResultCollection;

})(Backbone.Collection);
