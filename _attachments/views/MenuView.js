var MenuView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

MenuView = (function(superClass) {
  extend(MenuView, superClass);

  function MenuView() {
    this.render = bind(this.render, this);
    return MenuView.__super__.constructor.apply(this, arguments);
  }

  MenuView.prototype.el = '.question-buttons';

  MenuView.prototype.events = {
    "change": "render",
    "change #select-choice-0": "goto"
  };

  MenuView.prototype.goto = function(e) {
    var form, url;
    form = $('#select-choice-0').val();
    if (form !== '') {
      if (form === 'home') {
        url = '#';
      } else {
        url = '#new/result/' + escape(form);
      }
      return window.location.href = url;
    }
  };

  MenuView.prototype.render = function() {
    this.$el.html("<select name=\"select-choice-0\" id=\"select-choice-0\"> <option value=''>Select</option> <option value='home'>Home</option> </select>");
    $('select').selectmenu();
    return Coconut.questions.fetch({
      fetch: 'query',
      options: {
        query: {
          fun: QUERIES.byQuestion
        }
      },
      success: (function(_this) {
        return function() {
          _this.$el.find("#select-choice-0").append(Coconut.questions.map(function(question, index) {
            return "<option value='" + question.id + "'>" + question.id + "</option>";
          }).join(" "));
          $(".question-buttons").navbar();
          return _this.update();
        };
      })(this)
    });
  };

  MenuView.prototype.update = function() {
    Coconut.questions.each((function(_this) {
      return function(question, index) {
        var results;
        results = new ResultCollection();
        return results.fetch({
          include_docs: false,
          question: question.id,
          isComplete: false,
          success: function() {
            return $("#menu-" + index + " #menu-partial-amount").html(results.length);
          }
        });
      };
    })(this));
    return $.ajax("version", {
      success: function(result) {
        return $("#version").html(result);
      },
      error: $("#version").html("-")
    });
  };

  return MenuView;

})(Backbone.View);
