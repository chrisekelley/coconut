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
    "delete/:question_id": "deleteQuestion",
    "edit/:question_id": "editQuestion",
    "manage": "manage",
    "": "default"
  };

  Router.prototype["default"] = function() {
    $("#content").html("<img src='images/coconut_logo_hori_1_med.jpg'/>");
    return $("#content").empty();
  };

  Router.prototype.deleteQuestion = function(question_id) {
    console.log(Coconut.questions.get(question_id));
    return Coconut.questions.get(question_id).destroy({
      success: function() {
        Coconut.menuView.render();
        return Coconut.router.navigate("manage", true);
      }
    });
  };

  Router.prototype.manage = function() {
    return Coconut.questions.fetch({
      success: function() {
        $("#content").html("          <a href='#design'>New</a>          <table>            <thead>              <th>                <td>Name</td>              </th>              <th></th>              <th></th>            </thead>            <tbody>            </tbody>          </table>        ");
        return Coconut.questions.each(function(question) {
          return $("tbody").append("            <tr>              <td>" + question.id + "</td>              <td><a href='#edit/" + question.id + "'>edit</a></td>              <td><a href='#delete/" + question.id + "'>delete</a></td>            </tr>          ");
        });
      }
    });
  };

  Router.prototype.newResult = function(question_id) {
    if (Coconut.questionView == null) Coconut.questionView = new QuestionView();
    Coconut.questionView.result = new Result({
      question: question_id
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
      _id: result_id
    });
    return Coconut.questionView.result.fetch({
      success: function() {
        Coconut.questionView.model = new Question({
          id: Coconut.questionView.result.question()
        });
        return Coconut.questionView.model.fetch({
          success: function() {
            return Coconut.questionView.render();
          }
        });
      }
    });
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
    Coconut.menuView = new MenuView();
    Coconut.menuView.render();
    return Backbone.history.start();
  };

  return Router;

})(Backbone.Router);

Coconut = {};

Coconut.router = new Router();

Coconut.router.startApp();
