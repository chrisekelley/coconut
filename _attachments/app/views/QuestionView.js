var QuestionView;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
QuestionView = (function() {
  __extends(QuestionView, Backbone.View);
  function QuestionView() {
    this.render = __bind(this.render, this);
    QuestionView.__super__.constructor.apply(this, arguments);
  }
  QuestionView.prototype.el = $('#content');
  QuestionView.prototype.render = function() {
    this.el.html("      <form>        " + (this.toHTMLForm(this.model)) + "        <input type='submit' value='complete'>      </form>    ");
    if (this.result != null) {
      return js2form($('form'), this.result.toJSON());
    } else {
      return this.result = new Result({
        question: this.model.id
      });
    }
  };
  QuestionView.prototype.events = {
    "submit form": "complete"
  };
  QuestionView.prototype.complete = function() {
    this.result.set($('form').toObject());
    this.result.set({
      complete: true
    });
    this.result.save();
    return false;
  };
  QuestionView.prototype.toHTMLForm = function(questions, groupId) {
    if (questions == null) {
      questions = this.model;
    }
    if (questions.length == null) {
      questions = [questions];
    }
    return _.map(questions, __bind(function(question) {
      var name, newGroupId, question_id, repeatable, result;
      if (question.repeatable() === "true") {
        repeatable = "<button>+</button>";
      } else {
        repeatable = "";
      }
      if ((question.type() != null) && (question.label() != null) && question.label() !== "") {
        name = question.label().replace(/[^a-zA-Z0-9 -]/g, "").replace(/[ -]/g, "");
        if (question.repeatable() === "true") {
          name = name + "[0]";
          question_id = question.id() + "-0";
        }
        if (groupId != null) {
          name = "group." + groupId + "." + name;
        }
        result = "          <div class='question'>          ";
        if (!question.type().match(/hidden/)) {
          result += "            <label for='" + question_id + "'>" + (question.label()) + "</label>          ";
        }
        if (question.type().match(/textarea/)) {
          result += "            <textarea name='" + name + "' id='" + question_id + "'>" + (question.value()) + "</textarea>          ";
        } else {
          result += "            <input name='" + name + "' id='" + question_id + "' type='" + (question.type()) + "' value='" + (question.value()) + "'></input>          ";
        }
        result += "          </div>        ";
        return result + repeatable;
      } else {
        newGroupId = question_id;
        if (question.repeatable()) {
          newGroupId = newGroupId + "[0]";
        }
        return ("<div data-group-id='" + question_id + "' class='question group'>") + this.toHTMLForm(question.questions(), newGroupId) + "</div>" + repeatable;
      }
    }, this)).join("");
  };
  return QuestionView;
})();