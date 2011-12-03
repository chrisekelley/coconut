var DesignView, Question;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
DesignView = (function() {
  __extends(DesignView, Backbone.View);
  function DesignView() {
    this.render = __bind(this.render, this);
    DesignView.__super__.constructor.apply(this, arguments);
  }
  DesignView.prototype.initialize = function() {};
  DesignView.prototype.el = $('#content');
  DesignView.prototype.render = function() {
    var templateData;
    templateData = {};
    templateData.types = this.questionTypes;
    return $("#content").html(this.template(templateData));
  };
  DesignView.prototype.template = Handlebars.compile("    <style>      .question-definition{        border-style: dotted;        border-width: 1px;        margin: 10px;        margin-top: 30px;      }      .question-definition-controls{        float: right;      }      .group{        border-style: dotted;        border-width: 1px;      }    </style>    <select id='element_selector'>      {{#each types}}        <option>{{this}}</option>      {{/each}}    </select>    <button>Add</button>    <div id='questions'>    </div>    <button>Render</button>    <form id='render'></form>    <button>FormDump</button>    <button>Dump</button>    <textarea id='dump' style='width:100px;height:100px'></textarea>    <form>      <input name='name' type='text'></input>      <input name='1[0].drug' type='text'></input>      <input name='1[0].date' type='text'></input>      <input name='1[1].drug' type='text'></input>      <input name='1[1].date' type='text'></input>    </form>  ");
  DesignView.prototype.questionTypes = ["text", "number", "date", "datetime", "textarea", "hidden"];
  DesignView.prototype.events = {
    "click button:contains(Add)": "add",
    "click button:contains(Group)": "groupClick",
    "click button:contains(Ungroup)": "ungroupClick",
    "click button:contains(X)": "deleteClick",
    "click button:contains(@)": "toggleRepeatable",
    "click button:contains(Dump)": "dump",
    "click button:contains(FormDump)": "formDump",
    "click button:contains(Render)": "renderForm",
    "click button:contains(+)": "repeat"
  };
  DesignView.prototype.add = function(event) {
    var id, type;
    type = $(event.target).prev().val();
    id = Math.ceil(Math.random() * 1000);
    if ($("#questions").children().length > 0) {
      $("#questions").append("        <button>Group</button>      ");
    }
    return $("#questions").append("      <div data-repeat='false' class='question-definition' id='" + id + "'>        <div class='question-definition-controls'>          <button>@</button>          <input type='hidden' id=repeatable-" + id + " value='false'></input>          <button>X</button>        </div>        <div>Type: " + type + "</div>        <label for='label-" + id + "'>Label</label>        <input type='text' name='label-" + id + "' id='label-" + id + "'></input>        <input type='hidden' name='type-" + id + "' id='type-" + id + "' value='" + type + "'></input>        <input type='hidden' name='required-" + id + "' value='false'></input>      </div>    ");
  };
  DesignView.prototype.groupClick = function(event) {
    var groupDiv;
    groupDiv = $(event.target);
    this.group(groupDiv.prev(), groupDiv.next());
    return groupDiv.remove();
  };
  DesignView.prototype.group = function(group1, group2) {
    var group, id, _i, _len, _ref;
    _ref = [group1, group2];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      group = _ref[_i];
      if (group.attr("repeat") === "false" && group.children(".question-definition").length() > 0) {
        this.ungroup(group);
      }
    }
    id = Math.ceil(Math.random() * 1000);
    return group1.add(group2).wrapAll("      <div data-repeat='false' class='question-definition' id='" + id + "'>        <div class='question-definition-controls'>          <button>@</button>          <input type='hidden' id=repeatable-" + id + " value='false'></input>          <button>Ungroup</button>          <button>X</button>        </div>      </div>    ");
  };
  DesignView.prototype.ungroupClick = function(event) {
    var controls;
    controls = $(event.target).parent();
    return this.ungroup(controls);
  };
  DesignView.prototype.ungroup = function(itemInGroup) {
    var controls, firstQuestionDefinition;
    controls = itemInGroup.parent().children(".question-definition-controls");
    firstQuestionDefinition = itemInGroup.parent().children(".question-definition").first();
    itemInGroup.unwrap();
    controls.remove();
    firstQuestionDefinition.after("      <button>Group</button>    ");
    return itemInGroup;
  };
  DesignView.prototype.deleteClick = function(event) {
    return this.deleteQuestion($(event.target).parent().parent(".question-definition"));
  };
  DesignView.prototype.deleteQuestion = function(question) {
    var surroundingQuestion;
    surroundingQuestion = question.parent(".question-definition");
    if (surroundingQuestion.children(".question-definition").length === 2) {
      this.ungroup(question);
    }
    if (question.next("button").length === 1) {
      question.next("button").remove();
    } else {
      question.prev("button").remove();
    }
    return question.remove();
  };
  DesignView.prototype.toggleRepeatable = function(event) {
    var button, hiddenRepeatableInputElement;
    button = $(event.target);
    hiddenRepeatableInputElement = button.next();
    if (hiddenRepeatableInputElement.val() === "false") {
      button.attr("style", 'color:green');
      return hiddenRepeatableInputElement.val("true");
    } else {
      button.attr("style", 'color:red');
      return hiddenRepeatableInputElement.val("false");
    }
  };
  DesignView.prototype.questions = function() {
    return $('#questions').children();
  };
  DesignView.prototype.toJson = function() {
    return Question.toJSON(this.questions());
  };
  DesignView.prototype.toObject = function() {
    return Question.toObject(this.questions());
  };
  DesignView.prototype.toHTMLForm = function() {
    return Question.toHTMLForm(this.toObject());
  };
  DesignView.prototype.dump = function() {
    return $('#dump').html(this.toJson());
  };
  DesignView.prototype.renderForm = function() {
    return $('#render').html(this.toHTMLForm());
  };
  DesignView.prototype.formDump = function() {
    return $('#dump').html(JSON.stringify($('form').toObject()));
  };
  DesignView.prototype.repeat = function(event) {
    var button, inputElement, name, newIndex, newQuestion, questionID, re, _i, _len, _ref;
    button = $(event.target);
    newQuestion = button.prev(".question").clone();
    questionID = newQuestion.attr("data-group-id");
    if (questionID == null) {
      questionID = "";
    }
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
  return DesignView;
})();
Question = (function() {
  function Question() {}
  return Question;
})();
Question.toJSON = function(questions) {
  return JSON.stringify(Question.toObject(questions));
};
Question.toObject = function(questions) {
  return _(questions).chain().map(function(question) {
    var id, property, result, _i, _len, _ref;
    question = $(question);
    id = question.attr("id");
    if (!id) {
      return;
    }
    result = {
      id: id
    };
    _ref = ["label", "type", "repeatable"];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      property = _ref[_i];
      result[property] = question.find("#" + property + "-" + id).val();
    }
    if (question.find(".question-definition").length > 0) {
      result.questions = Question.toObject(question.find(".question-definition"));
    }
    return result;
  }).compact().value();
};
Question.toHTMLForm = function(questions, groupId) {
  return _.map(questions, function(question) {
    var name, newGroupId, repeatable, result;
    if (question.repeatable === "true") {
      repeatable = "<button>+</button>";
    } else {
      repeatable = "";
    }
    if ((question.type != null) && (question.label != null) && question.label !== "") {
      name = question.label.replace(/[^a-zA-Z0-9 -]/g, "").replace(/[ -]/g, "");
      if (question.repeatable === "true") {
        name = name + "[0]";
        question.id = question.id + "-0";
      }
      if (groupId != null) {
        name = "group." + groupId + "." + name;
      }
      result = "        <div class='question'>          <label for='" + question.id + "'>" + question.label + "</label>          <input name='" + name + "' id='" + question.id + "' type='" + question.type + "'></input>        </div>      ";
      return result + repeatable;
    } else {
      newGroupId = question.id;
      if (question.repeatable) {
        newGroupId = newGroupId + "[0]";
      }
      return ("<div data-group-id='" + question.id + "' class='question group'>") + Question.toHTMLForm(question.questions, newGroupId) + "</div>" + repeatable;
    }
  }).join("");
};