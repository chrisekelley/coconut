var Question,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Question = (function(_super) {

  __extends(Question, _super);

  function Question() {
    this.summaryFieldNames = __bind(this.summaryFieldNames, this);
    this.resultSummaryFields = __bind(this.resultSummaryFields, this);
    Question.__super__.constructor.apply(this, arguments);
  }

  Question.prototype.type = function() {
    return this.get("type");
  };

  Question.prototype.label = function() {
    if (this.get("label") != null) {
      return this.get("label");
    } else {
      return "";
    }
  };

  Question.prototype.repeatable = function() {
    return this.get("repeatable");
  };

  Question.prototype.questions = function() {
    return this.get("questions");
  };

  Question.prototype.value = function() {
    if (this.get("value") != null) {
      return this.get("value");
    } else {
      return "";
    }
  };

  Question.prototype.url = "/question";

  Question.prototype.set = function(attributes) {
    if (attributes.questions != null) {
      attributes.questions = _.map(attributes.questions, function(question) {
        return new Question(question);
      });
    }
    if (attributes.id != null) attributes._id = attributes.id;
    return Question.__super__.set.call(this, attributes);
  };

  Question.prototype.loadFromDesigner = function(domNode) {
    var attribute, property, result, _i, _len, _ref;
    result = Question.fromDomNode(domNode);
    if (result.length === 1) {
      result = result[0];
      this.set({
        id: result.id
      });
      _ref = ["label", "type", "repeatable"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        property = _ref[_i];
        attribute = {};
        attribute[property] = result.get(property);
        this.set(attribute);
      }
      return this.set({
        questions: result.questions()
      });
    } else {
      throw "More than one root node";
    }
  };

  Question.prototype.resultSummaryFields = function() {
    var resultSummaryFields,
      _this = this;
    resultSummaryFields = this.get("resultSummaryFields");
    if (!resultSummaryFields) {
      resultSummaryFields = {};
      _.each([0, 1, 2], function(index) {
        return resultSummaryFields[_this.questions()[index].label()] = "on";
      });
    }
    return resultSummaryFields;
  };

  Question.prototype.summaryFieldNames = function() {
    return _.keys(this.resultSummaryFields());
  };

  Question.prototype.summaryFieldKeys = function() {
    return _.map(this.summaryFieldNames(), function(key) {
      return key.replace(/[^a-zA-Z0-9 -]/g, "").replace(/[ -]/g, "");
    });
  };

  return Question;

})(Backbone.Model);

Question.fromDomNode = function(domNode) {
  return _(domNode).chain().map(function(question) {
    var attribute, id, property, propertyValue, result, _i, _len, _ref;
    question = $(question);
    id = question.attr("id");
    if (question.children("#rootQuestionName").length > 0) {
      id = question.children("#rootQuestionName").val();
    }
    if (!id) return;
    result = new Question;
    result.set({
      id: id
    });
    _ref = ["label", "type", "repeatable", "select-options"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      property = _ref[_i];
      attribute = {};
      propertyValue = question.find("#" + property + "-" + id).val();
      if (propertyValue) {
        if (propertyValue) attribute[property] = propertyValue;
        result.set(attribute);
      }
    }
    if (question.find(".question-definition").length > 0) {
      result.set({
        questions: Question.fromDomNode(question.children(".question-definition"))
      });
    }
    return result;
  }).compact().value();
};
