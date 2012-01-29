var TodoView;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
TodoView = (function() {
  __extends(TodoView, Backbone.View);
  function TodoView() {
    this.render = __bind(this.render, this);
    TodoView.__super__.constructor.apply(this, arguments);
  }
  TodoView.prototype.initialize = function() {};
  TodoView.prototype.el = $('#content');
  TodoView.prototype.render = function() {
    return this.el.html(this.template(this.templateData));
  };
  TodoView.prototype.template = Handlebars.compile("    <h1>Facility</h1>    <h2>Items Todo</h2>    <ul>      {{#each todoItems}}        <li><a href='#collect/{{form}}/{{caseID}}'>Collect</a>  {{shahia}} - {{firstName}} - {{caseID}}</li>      {{/each}}    </ul>    <hr/>    <h2>Items Completed</h2>    <ul>      {{#each completedItems}}        <li><a href='#result/{{form}}/{{caseID}}'>Result</a>  {{shahia}} - {{firstName}} - {{caseID}} - {{date}}</li>      {{/each}}    </ul>  ");
  return TodoView;
})();