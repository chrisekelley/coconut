var ResultsView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ResultsView = (function(superClass) {
  extend(ResultsView, superClass);

  function ResultsView() {
    this.render = bind(this.render, this);
    return ResultsView.__super__.constructor.apply(this, arguments);
  }

  ResultsView.prototype.initialize = function() {
    return this.question = new Question();
  };

  ResultsView.prototype.el = '#content';

  ResultsView.prototype.render = function() {
    this.$el.html(("<style> table.results th.header, table.results td{ font-size:150%; } </style> <div class='not-complete' data-collapsed='false' data-role='collapsible'> <h2>'" + this.question.id + "' Items Not Completed (<span class='count-complete-false'></span>)</h2> <table class='results complete-false tablesorter'> <thead><tr>") + _.map(this.question.summaryFieldNames(), function(summaryField) {
      return "<th class='header'>" + summaryField + "</th>";
    }).join("") + ("<th></th> </tr></thead> <tbody> </tbody> </table> <a href='#new/result/" + (escape(this.question.id)) + "'>Add new '" + this.question.id + "'</a> </div> <div class='complete' data-role='collapsible'> <h2>'" + this.question.id + "' Items Completed (<span class='count-complete-true'></span>)</h2> <table class='results complete-true tablesorter'> <thead><tr>") + _.map(this.question.summaryFieldNames(), function(summaryField) {
      return "<th class='header'>" + summaryField + "</th>";
    }).join("") + "<th></th> </tr></thead> <tbody> </tbody> </table> </div>");
    $("a").button();
    $('table').tablesorter();
    $('table').addTableFilter({
      labelText: null
    });
    $("input[type=search]").textinput();
    $('[data-role=collapsible]').collapsible();
    this.loadIncompleteResults();
    $('.complete').bind("expand", (function(_this) {
      return function() {
        if (!($('.complete tr td').length > 0)) {
          return _this.loadCompleteResults();
        }
      };
    })(this));
    return this.updateCountComplete();
  };

  ResultsView.prototype.updateCountComplete = function() {
    var results;
    results = new ResultCollection();
    return results.fetch({
      include_docs: false,
      question: this.question.id,
      isComplete: true,
      success: (function(_this) {
        return function() {
          return $(".count-complete-true").html(results.length);
        };
      })(this)
    });
  };

  ResultsView.prototype.loadIncompleteResults = function() {
    return this.loadResults(false);
  };

  ResultsView.prototype.loadCompleteResults = function() {
    return this.loadResults(true);
  };

  ResultsView.prototype.loadResults = function(complete) {
    var results;
    results = new ResultCollection();
    return results.fetch({
      include_docs: true,
      question: this.question.id,
      isComplete: complete,
      success: (function(_this) {
        return function() {
          $(".count-complete-" + complete).html(results.length);
          return results.each(function(result, index) {
            $("table.complete-" + complete + " tbody").append("<tr>" + (_.map(result.summaryValues(_this.question), function(value) {
              return "<td><a href='#edit/result/" + result.id + "'>" + value + "</a></td>";
            }).join("")) + ("<td><a href='#delete/result/" + result.id + "' data-icon='delete' data-iconpos='notext'>Delete</a></td> </tr>"));
            if (index + 1 === results.length) {
              $("table a").button();
              $("table").trigger("update");
            }
            return _.each($('table tr'), function(row, index) {
              if (index % 2 === 1) {
                return $(row).addClass("odd");
              }
            });
          });
        };
      })(this)
    });
  };

  return ResultsView;

})(Backbone.View);
