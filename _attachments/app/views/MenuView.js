var MenuView,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

MenuView = (function(_super) {

  __extends(MenuView, _super);

  function MenuView() {
    this.render = __bind(this.render, this);
    MenuView.__super__.constructor.apply(this, arguments);
  }

  MenuView.prototype.el = $('#menu');

  MenuView.prototype.render = function() {
    var _this = this;
    this.el.html("      <span class='questions'>      </span>      <span class='otherNavigation'>        <a href='#manage'>Manage</a>        <a href='#logout'>Logout</a>      </span>    ");
    return Coconut.questions.fetch({
      success: function() {
        var questionLinks;
        questionLinks = Coconut.questions.map(function(question) {
          return "<a href='#show/results/" + question.id + "'>" + question.id + "</a>";
        }).join(" ");
        return _this.el.find(".questions").html(questionLinks);
      }
    });
  };

  return MenuView;

})(Backbone.View);
