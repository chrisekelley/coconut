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
    "show/results/:question_id": "showResults",
    "new/result/:question_id": "newResult",
    "edit/result/:result_id": "editResult",
    "analyze/:form_id": "analyze",
    "": "default"
  };

  Router.prototype["default"] = function() {
    $("#content").html("<img src='images/coconut_logo_hori_1_med.jpg'/>");
    $("#content").empty();
    return Coconut.questions.fetch({
      success: function() {
        return _.each(Coconut.questions.models, function(question) {
          return $("div#menu").prepend("            <a href='#show/results/" + question.id + "'>" + question.id + "</a>          ");
        });
      }
    });
  };

  Router.prototype.newResult = function(question_id) {
    if (Coconut.questionView == null) Coconut.questionView = new QuestionView();
    Coconut.questionView.result = new Result({
      question: this.model.id
    });
    Coconut.questionView.model = new Question({
      id: question_id
    });
    return Coconut.questionView.model.fetch({
      success: function() {
        return Coconut.questionView.render();
      }
    });
  };

  Router.prototype.editResult = function(result_id) {
    if (Coconut.questionView == null) Coconut.questionView = new QuestionView();
    Coconut.questionView.result = new Result({
      question: this.model.id
    });
    Coconut.questionView.model = new Question({
      id: question_id
    });
    return Coconut.questionView.model.fetch({
      success: function() {
        return Coconut.questionView.render();
      }
    });
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

  Router.prototype.showResults = function(question_id) {
    var rowTemplate;
    $("#content").html("      <h1>" + question_id + "</h1>      <a href='#new/result/" + question_id + "'>Start new result</a>      <h2>Partial Results</h2>      <table class='notComplete'>        <thead><tr>          <th>Name</th>          <th></th>          <th></th>        </tr></thead>      </table>      <h2>Complete Results</h2>      <table class='complete'>        <thead><tr>          <th>Name</th>          <th></th>          <th></th>        </tr></thead>      </table>    ");
    rowTemplate = Handlebars.compile("      <tr>        <td>{{toShortString}}</td>        <td><a href='#edit/result/{{id}}'>Edit</a></td>        <td><a href='#view/result/{{id}}'>View</a></td>      </tr>    ");
    if (Coconut.resultCollection == null) {
      Coconut.resultCollection = new ResultCollection();
    }
    return Coconut.resultCollection.fetch({
      success: function() {
        return Coconut.resultCollection.each(function(result) {
          return result.fetch({
            success: function() {
              if (result.question() !== question_id) return;
              if (result.get("complete") === true) {
                return $("table.complete").append(rowTemplate(result));
              } else {
                return $("table.notComplete").append(rowTemplate(result));
              }
            }
          });
        });
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
