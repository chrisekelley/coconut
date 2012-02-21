var QuestionView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

QuestionView = (function(_super) {

  __extends(QuestionView, _super);

  function QuestionView() {
    this.render = __bind(this.render, this);
    QuestionView.__super__.constructor.apply(this, arguments);
  }

  QuestionView.prototype.el = $('#content');

  QuestionView.prototype.render = function() {
    this.el.html("      <div style='display:none' id='messageText'>        Saving...      </div>      <div id='question-view'>        <form>          " + (this.toHTMLForm(this.model)) + "        </form>      </div>    ");
    js2form($('form').get(0), this.result.toJSON());
    return $("input[name=Tags]").tagit({
      availableTags: ["complete"],
      onTagChanged: function() {
        return $("input[name=Tags]").trigger('change');
      }
    });
  };

  QuestionView.prototype.events = {
    "change #question-view input": "save",
    "change #question-view select": "save",
    "click #question-view button:contains(+)": "repeat"
  };

  QuestionView.prototype.save = function() {
    this.result.set($('form').toObject());
    $("#messageText").slideDown().fadeOut();
    return this.result.save();
  };

  QuestionView.prototype.repeat = function(event) {
    var button, inputElement, name, newIndex, newQuestion, questionID, re, _i, _len, _ref;
    button = $(event.target);
    newQuestion = button.prev(".question").clone();
    questionID = newQuestion.attr("data-group-id");
    if (questionID == null) questionID = "";
    _ref = newQuestion.find("input");
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      inputElement = _ref[_i];
      inputElement = $(inputElement);
      name = inputElement.attr("name");
      re = new RegExp("" + questionID + "\\[(\\d)\\]");
      newIndex = parseInt(_.last(name.match(re))) + 1;
      inputElement.attr("name", name.replace(re, "" + questionID + "[" + newIndex + "]"));
    }
    button.after(newQuestion.add(button.clone()));
    return button.remove();
  };

  QuestionView.prototype.toHTMLForm = function(questions, groupId) {
    var _this = this;
    if (questions == null) questions = this.model;
    if (questions.length == null) questions = [questions];
    return _.map(questions, function(question) {
      var name, newGroupId, question_id, repeatable, result;
      if (question.repeatable() === "true") {
        repeatable = "<button>+</button>";
      } else {
        repeatable = "";
      }
      if ((question.type() != null) && (question.label() != null) && question.label() !== "") {
        name = question.label().replace(/[^a-zA-Z0-9 -]/g, "").replace(/[ -]/g, "");
        question_id = question.get("id");
        if (question.repeatable() === "true") {
          name = name + "[0]";
          question_id = question.get("id") + "-0";
        }
        if (groupId != null) name = "group." + groupId + "." + name;
        result = "          <div class='question'>        ";
        if (!question.type().match(/hidden/)) {
          result += "            <label for='" + question_id + "'>" + (question.label()) + "</label>          ";
        }
        if (question.type().match(/textarea/)) {
          result += "            <textarea name='" + name + "' id='" + question_id + "'>" + (question.value()) + "</textarea>          ";
        } else if (question.type().match(/select/)) {
          result += "            <select name='" + name + "'>          ";
          _.each(question.get("select-options").split(/, */), function(option) {
            return result += "              <option>" + option + "</option>            ";
          });
          result += "            </select>          ";
        } else {
          result += "            <input name='" + name + "' id='" + question_id + "' type='" + (question.type()) + "' value='" + (question.value()) + "'></input>          ";
        }
        result += "          </div>        ";
        return result + repeatable;
      } else {
        newGroupId = question_id;
        if (question.repeatable()) newGroupId = newGroupId + "[0]";
        return ("<div data-group-id='" + question_id + "' class='question group'>") + _this.toHTMLForm(question.questions(), newGroupId) + "</div>" + repeatable;
      }
    }).join("");
  };

  return QuestionView;

})(Backbone.View);
