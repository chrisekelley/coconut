var ResultsView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

ResultsView = (function(_super) {
  var rowTemplate;

  __extends(ResultsView, _super);

  function ResultsView() {
    this.render = __bind(this.render, this);
    ResultsView.__super__.constructor.apply(this, arguments);
  }

  ResultsView.prototype.initialize = function() {
    return this.question = new Question();
  };

  ResultsView.prototype.el = $('#content');

  ResultsView.prototype.render = function() {
    var _this = this;
    this.el.html(("      <h1>" + this.question.id + "</h1>      <a href='#new/result/" + this.question.id + "'>Start new result</a>      <h2>Partial Results</h2>      <table class='results notComplete tablesorter'>        <thead><tr>    ") + _.map(this.question.summaryFieldNames(), function(summaryField) {
      return "<th>" + summaryField + "</th>";
    }).join("") + ("          <th class='manage small-button'><a href='#edit/resultSummary/" + this.question.id + "'>Edit Columns</a></small></th>          <th></th>        </tr></thead>        <tbody>        </tbody>      </table>      <h2>Complete Results</h2>      <table class='results complete tablesorter'>        <thead><tr>    ") + _.map(this.question.summaryFieldNames(), function(summaryField) {
      return "<th>" + summaryField + "</th>";
    }).join("") + ("          <th class='manage small-button'><a href='#edit/resultSummary/" + this.question.id + "'>Edit Columns</a></small></th>          <th></th>        </tr></thead>        <tbody>        </tbody>      </table>    "));
    if (Coconut.resultCollection == null) {
      Coconut.resultCollection = new ResultCollection();
    }
    return Coconut.resultCollection.fetch({
      success: function() {
        var itemsToProcess;
        itemsToProcess = Coconut.resultCollection.length;
        return Coconut.resultCollection.each(function(result) {
          return result.fetch({
            success: function() {
              var relevantKeys, templateData;
              relevantKeys = _this.question.summaryFieldKeys();
              if (relevantKeys.length === 0) {
                relevantKeys = _.difference(_.keys(result.toJSON()), ["_id", "_rev", "complete", "question", "collection"]);
              }
              if (result.question() !== _this.question.id) {
                itemsToProcess--;
                return;
              }
              templateData = {
                id: result.id,
                resultFields: _.map(relevantKeys, function(key) {
                  var returnVal;
                  returnVal = result.get(key) || "";
                  if (typeof returnVal === "object") {
                    returnVal = JSON.stringify(returnVal);
                  }
                  return returnVal;
                })
              };
              if (result.complete()) {
                $("table.Complete tbody").append(rowTemplate(templateData));
              } else {
                $("table.notComplete tbody").append(rowTemplate(templateData));
              }
              if (--itemsToProcess === 0) {
                $('table').tableFilter();
                return $('table').tablesorter();
              }
            }
          });
        });
      }
    });
  };

  rowTemplate = Handlebars.compile("    <tr>      {{#each resultFields}}        <td>{{this}}</td>      {{/each}}      <td><a href='#edit/result/{{id}}'>Edit</a></td>      <td><a href='#view/result/{{id}}'>View</a></td>    </tr>  ");

  return ResultsView;

})(Backbone.View);
