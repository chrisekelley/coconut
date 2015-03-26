var ResultSummaryEditorView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ResultSummaryEditorView = (function(superClass) {
  extend(ResultSummaryEditorView, superClass);

  function ResultSummaryEditorView() {
    this.render = bind(this.render, this);
    return ResultSummaryEditorView.__super__.constructor.apply(this, arguments);
  }

  ResultSummaryEditorView.prototype.initialize = function() {};

  ResultSummaryEditorView.prototype.el = $('#content');

  ResultSummaryEditorView.prototype.events = {
    "submit #resultSummaryEditor form": "save"
  };

  ResultSummaryEditorView.prototype.save = function() {
    this.question.set({
      resultSummaryFields: $('form').toObject()
    });
    this.question.save();
    return false;
  };

  ResultSummaryEditorView.prototype.render = function() {
    var result;
    result = "<div id='resultSummaryEditor'> Check the boxes to use for summarizing results for <b>" + this.question.id + "</b>:<br/> <form> <ul>";
    _.each(this.question.questions(), function(question, index) {
      return result += "<li> <input id='result-summary-option-" + index + "' name='" + (question.label()) + "' type='checkbox'></input> <label for='result-summary-option-" + index + "'>" + (question.label()) + "</label> </li>";
    });
    result += "</ul> <input type='submit' value='Save'></input> </form> </div>";
    this.$el.html(result);
    console.log(this.question);
    return js2form($('form').get(0), this.question.resultSummaryFields());
  };

  return ResultSummaryEditorView;

})(Backbone.View);
