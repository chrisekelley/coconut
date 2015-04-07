var Question,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Question = (function(superClass) {
  extend(Question, superClass);

  function Question() {
    this.summaryFieldNames = bind(this.summaryFieldNames, this);
    this.resultSummaryFields = bind(this.resultSummaryFields, this);
    return Question.__super__.constructor.apply(this, arguments);
  }

  Question.prototype.type = function() {
    return this.get("type");
  };

  Question.prototype.label = function() {
    if (this.get("label") != null) {
      return this.get("label");
    } else {
      return this.get("id");
    }
  };

  Question.prototype.safeLabel = function() {
    return this.get("safeLabel");
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

  Question.prototype.required = function() {
    if (this.get("required") != null) {
      return this.get("required");
    } else {
      return "true";
    }
  };

  Question.prototype.validation = function() {
    if (this.get("validation") != null) {
      return this.get("validation");
    } else {
      return null;
    }
  };

  Question.prototype.skipLogic = function() {
    return this.get("skip_logic") || "";
  };

  Question.prototype.actionOnChange = function() {
    return this.get("action_on_change") || "";
  };

  Question.prototype.eventOnChange = function() {
    return this.get("event_on_change") || "";
  };

  Question.prototype.attributeSafeText = function() {
    var returnVal;
    returnVal = this.get("label") != null ? this.get("label") : this.get("id");
    return returnVal.replace(/[^a-zA-Z0-9]/g, "");
  };

  Question.prototype.url = "/question";

  Question.prototype.set = function(attributes) {
    if (attributes.questions != null) {
      attributes.questions = _.map(attributes.questions, function(question) {
        return new Question(question);
      });
    }
    if (attributes.id != null) {
      attributes._id = attributes.id;
    }
    return Question.__super__.set.call(this, attributes);
  };

  Question.prototype.loadFromDesigner = function(domNode) {
    var attribute, i, j, k, len, len1, len2, property, question, questionArray, questionProperties, ref, ref1, ref2, result;
    result = Question.fromDomNode(domNode);
    if (result.length === 1) {
      result = result[0];
      this.set({
        id: result.id,
        enabled: result.get("enabled")
      });
      questionProperties = {
        id: result.id,
        _id: result.id,
        enabled: result.get("enabled")
      };
      ref = ["label", "type", "repeatable", "required", "validation", "enabled"];
      for (i = 0, len = ref.length; i < len; i++) {
        property = ref[i];
        attribute = {};
        attribute[property] = result.get(property);
        this.set(attribute);
        _.extend(questionProperties, attribute);
      }
      questionArray = [];
      ref1 = result.questions();
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        question = ref1[j];
        attribute = {};
        ref2 = ["id", "_id", "label", "type", "repeatable", "required", "validation", "safeLabel", "radio-options", "select-options"];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          property = ref2[k];
          attribute[property] = question.attributes.get(property);
        }
        questionArray.push(attribute);
      }
      questionProperties.questions = questionArray;
      questionProperties.collection = 'question';
      return this.questionProperties = questionProperties;
    } else {
      throw "More than one root node";
    }
  };

  Question.prototype.resultSummaryFields = function() {
    var i, numberOfFields, resultSummaryFields, results, returnValue;
    resultSummaryFields = this.get("resultSummaryFields");
    if (resultSummaryFields) {
      return resultSummaryFields;
    } else {
      numberOfFields = Math.min(2, this.questions().length - 1);
      returnValue = {};
      _.each((function() {
        results = [];
        for (var i = 0; 0 <= numberOfFields ? i <= numberOfFields : i >= numberOfFields; 0 <= numberOfFields ? i++ : i--){ results.push(i); }
        return results;
      }).apply(this), (function(_this) {
        return function(index) {
          var ref;
          return returnValue[(ref = _this.questions()[index]) != null ? ref.label() : void 0] = "on";
        };
      })(this));
      return returnValue;
    }
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
  return _(domNode).chain().map((function(_this) {
    return function(question) {
      var attribute, enabled, i, id, len, property, propertyValue, ref, result;
      question = $(question);
      id = question.attr("id");
      if (question.children("#rootQuestionName").length > 0) {
        id = question.children("#rootQuestionName").val();
      }
      enabled = question.children("#rootQuestionEnabled").attr('checked');
      if (!id) {
        return;
      }
      result = new Question;
      result.set({
        id: id,
        enabled: enabled
      });
      ref = ["label", "type", "repeatable", "select-options", "radio-options", "autocomplete-options", "validation", "required", "action_on_questions_loaded", "skip_logic", "action_on_change", "image-path", "image-style"];
      for (i = 0, len = ref.length; i < len; i++) {
        property = ref[i];
        attribute = {};
        propertyValue = question.find("#" + property + "-" + id).val();
        if (property === "required") {
          propertyValue = String(question.find("#" + property + "-" + id).is(":checked"));
        }
        if (propertyValue != null) {
          attribute[property] = propertyValue;
          result.set(attribute);
        }
      }
      result.set({
        safeLabel: result.safeLabel()
      });
      if (question.find(".question-definition").length > 0) {
        result.set({
          questions: Question.fromDomNode(question.children(".question-definition"))
        });
      }
      return result;
    };
  })(this)).compact().value();
};
