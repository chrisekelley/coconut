var Coconut, Router,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

Router = (function(_super) {

  __extends(Router, _super);

  function Router() {
    Router.__super__.constructor.apply(this, arguments);
  }

  Router.prototype.routes = {
    "design": "design",
    "select": "select",
    "facility": "facility",
    "househould": "household",
    "collect/:question_id/:case_id": "collect",
    "analyze/:form_id": "analyze",
    "": "blank"
  };

  Router.prototype.blank = function() {
    return $("#content").html("<img src='images/coconut_logo_hori_1_med.jpg'/>");
  };

  Router.prototype.facility = function() {
    Coconut.todoView.templateData = {
      todoType: "Facility",
      todoItems: [
        {
          form: "facility",
          caseID: "XASDAX",
          shahia: "Washoe",
          firstName: "Abdul"
        }, {
          form: "facility",
          caseID: "XSSDAX",
          shahia: "Reno",
          firstName: "Mohammed"
        }
      ],
      completedItems: [
        {
          form: "facility",
          caseID: "ASSXXZ",
          shahia: "Stone Town",
          firstName: "Sarah",
          date: "11-Nov-2011"
        }, {
          form: "facility",
          caseID: "XASDAX",
          shahia: "Washoe",
          firstName: "Eva",
          date: "11-Dec-2011"
        }
      ]
    };
    return Coconut.todoView.render();
  };

  Router.prototype.household = function() {
    Coconut.todoView.templateData = {
      todoType: "Household",
      todoItems: [
        {
          form: "facility",
          caseID: "XASDAX",
          shahia: "Washoe",
          firstName: "Abdul"
        }, {
          form: "facility",
          caseID: "XSSDAX",
          shahia: "Reno",
          firstName: "Mohammed"
        }
      ],
      completedItems: [
        {
          form: "facility",
          caseID: "ASSXXZ",
          shahia: "Stone Town",
          firstName: "Sarah",
          date: "11-Nov-2011"
        }, {
          form: "facility",
          caseID: "XASDAX",
          shahia: "Washoe",
          firstName: "Eva",
          date: "11-Dec-2011"
        }
      ]
    };
    return Coconut.todoView.render();
  };

  Router.prototype.design = function() {
    $("#content").empty();
    if (Coconut.designView == null) Coconut.designView = new DesignView();
    return Coconut.designView.render();
  };

  Router.prototype.select = function() {
    $("#content").empty();
    return Coconut.questions.fetch({
      success: function() {
        if (Coconut.formSelectView == null) {
          Coconut.formSelectView = new FormSelectView();
        }
        return Coconut.formSelectView.render();
      }
    });
  };

  Router.prototype.collect = function(question_id, case_id) {
    var question;
    $("#content").empty();
    question = new Question({
      id: question_id,
      case_id: case_id
    });
    return question.fetch({
      success: function() {
        Coconut.questionView.model = question;
        return Coconut.questionView.render();
      }
    });
  };

  Router.prototype.startApp = function() {
    Coconut.questions = new QuestionCollection();
    Coconut.questionView = new QuestionView();
    Coconut.todoView = new TodoView();
    return Backbone.history.start();
  };

  return Router;

})(Backbone.Router);

Coconut = {};

Coconut.router = new Router();

Coconut.router.startApp();
