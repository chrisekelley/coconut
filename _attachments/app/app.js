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
    "edit/resultSummary/:question_id": "editResultSummary",
    "analyze/:form_id": "analyze",
    "delete/:question_id": "deleteQuestion",
    "edit/:question_id": "editQuestion",
    "manage": "manage",
    "": "default"
  };

  Router.prototype.route = function(route, name, callback) {
    var _this = this;
    Backbone.history || (Backbone.history = new Backbone.History);
    if (!_.isRegExp(route)) route = this._routeToRegExp(route);
    return Backbone.history.route(route, function(fragment) {
      var args;
      args = _this._extractParameters(route, fragment);
      callback.apply(_this, args);
      $('#loading').slideDown();
      _this.trigger.apply(_this, ['route:' + name].concat(args));
      return $('#loading').fadeOut();
    }, this);
  };

  Router.prototype["default"] = function() {
    $("#content").html("<img src='images/coconut_logo_hori_1_med.jpg'/>");
    return $("#content").empty();
  };

  Router.prototype.editResultSummary = function(question_id) {
    if (Coconut.resultSummaryEditor == null) {
      Coconut.resultSummaryEditor = new ResultSummaryEditorView();
    }
    Coconut.resultSummaryEditor.question = new Question({
      id: question_id
    });
    return Coconut.resultSummaryEditor.question.fetch({
      success: function() {
        return Coconut.resultSummaryEditor.render();
      }
    });
  };

  Router.prototype.editQuestion = function(question_id) {
    if (Coconut.designView == null) Coconut.designView = new DesignView();
    Coconut.designView.render();
    return Coconut.designView.loadQuestion(question_id);
  };

  Router.prototype.deleteQuestion = function(question_id) {
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
        $("#content").html("          <a href='#design'>New</a>          <table>            <thead>              <th>                <td>Name</td>              </th>              <th></th>              <th></th>              <th></th>            </thead>            <tbody>            </tbody>          </table>        ");
        return Coconut.questions.each(function(question) {
          return $("tbody").append("            <tr>              <td>" + question.id + "</td>              <td><a href='#edit/" + question.id + "'>edit</a></td>              <td><a href='#delete/" + question.id + "'>delete</a></td>              <td><a href='#edit/resultSummary/" + question.id + "'>summary</a></td>            </tr>          ");
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
    if (Coconut.resultsView == null) Coconut.resultsView = new ResultsView();
    Coconut.resultsView.question = new Question({
      id: question_id
    });
    return Coconut.resultsView.question.fetch({
      success: function() {
        return Coconut.resultsView.render();
      }
    });
  };

  Router.prototype.startApp = function() {
    Coconut.questions = new QuestionCollection();
    Coconut.questionView = new QuestionView();
    Coconut.todoView = new TodoView();
    Coconut.menuView = new MenuView();
    Coconut.menuView.render();
    Backbone.history.start();
    Coconut.config = new Config();
    return Coconut.config.fetch({
      success: function() {
        return $('#application-title').html(Coconut.config.title());
      }
    });
  };

  return Router;

})(Backbone.Router);

Coconut = {};

Coconut.router = new Router();

Coconut.router.startApp();
