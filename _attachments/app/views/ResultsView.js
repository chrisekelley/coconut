var ResultsView;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
ResultsView = (function() {
  var rowTemplate;
  __extends(ResultsView, Backbone.View);
  function ResultsView() {
    this.render = __bind(this.render, this);
    ResultsView.__super__.constructor.apply(this, arguments);
  }
  ResultsView.prototype.initialize = function() {
    return this.question = new Question();
  };
  ResultsView.prototype.el = $('#content');
  ResultsView.prototype.render = function() {
    var _ref;
    this.el.html(this.template(this.question.attributes));
    if ((_ref = Coconut.resultCollection) == null) {
      Coconut.resultCollection = new ResultCollection();
    }
    return Coconut.resultCollection.fetch({
      success: __bind(function() {
        return Coconut.resultCollection.each(__bind(function(result) {
          return result.fetch({
            success: __bind(function() {
              if (result.question() !== this.question.id) {
                return;
              }
              if (result.get("complete") === true) {
                return $("table.complete tbody").append(rowTemplate(result));
              } else {
                return $("table.notComplete tbody").append(rowTemplate(result));
              }
            }, this)
          });
        }, this));
      }, this)
    });
  };
  ResultsView.prototype.template = Handlebars.compile("    <h1>{{id}}</h1>    <a href='#new/result/{{id}}'>Start new result</a>    <h2>Partial Results</h2>    <table class='notComplete'>      <thead><tr>        <th>Name</th>        <th></th>        <th></th>      </tr></thead>      <tbody>      </tbody>    </table>    <h2>Complete Results</h2>    <table class='complete'>      <thead><tr>        <th>Name</th>        <th></th>        <th></th>      </tr></thead>      <tbody>      </tbody>    </table>  ");
  rowTemplate = Handlebars.compile("    <tr>      <td>{{toShortString}}</td>      <td><a href='#edit/result/{{id}}'>Edit</a></td>      <td><a href='#view/result/{{id}}'>View</a></td>    </tr>  ");
  return ResultsView;
})();