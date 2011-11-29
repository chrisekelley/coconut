var DesignView;
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; }, __hasProp = Object.prototype.hasOwnProperty, __extends = function(child, parent) {
  for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; }
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor;
  child.__super__ = parent.prototype;
  return child;
};
DesignView = (function() {
  __extends(DesignView, Backbone.Model);
  function DesignView() {
    this.render = __bind(this.render, this);
    this.add = __bind(this.add, this);
    DesignView.__super__.constructor.apply(this, arguments);
  }
  DesignView.prototype.template = Handlebars.compile("    <select id='element_selector'>      {{#each types}}        <option>{{this}}</option>      {{/each}}    </select>    <button>Add</button>    <div id='questions'>    </div>  ");
  DesignView.prototype.initialize = function() {
    return $("button:contains(Add)").live("click", this.add);
  };
  DesignView.prototype.events = {
    "click": "add",
    "click button:contains(Add)": "add"
  };
  DesignView.prototype.add = function(event) {
    console.log("FOO");
    return console.log(target);
  };
  DesignView.prototype.render = function() {
    var templateData;
    templateData = {};
    templateData.types = "string,date,number,textarea".split(',');
    return $("#content").html(this.template(templateData));
  };
  return DesignView;
})();