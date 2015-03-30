var ManageView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ManageView = (function(superClass) {
  extend(ManageView, superClass);

  function ManageView() {
    this.render = bind(this.render, this);
    return ManageView.__super__.constructor.apply(this, arguments);
  }

  ManageView.prototype.el = '#content';

  ManageView.prototype.render = function() {
    this.$el.html("<a data-role='button' class='btn btn-primary btn-lg' href='#sync'>Sync</a> <a data-role='button' class='btn btn-primary btn-lg' href='#configure'>Set cloud vs mobile</a> <!-- a href='#users'>Manage users</a --> <!-- a href='#messaging'>Send message to users</a --> <h2>Question Sets</h2> <a href='#design'>New</a> <table style='width:100%'> <thead> <th></th> <th></th> <th></th> <th></th> </thead> <tbody> </tbody> </table>");
    return Coconut.questions.fetch({
      success: function() {
        return Coconut.questions.each(function(question) {
          var questionId, questionName;
          questionName = question.id;
          questionId = escape(question.id);
          return $("tbody").append("<tr> <td>" + questionName + "</td> <td><a href='#edit/" + questionId + "'>edit</a></td> <td><a href='#delete/" + questionId + "'>delete</a></td> <td><a href='#edit/resultSummary/" + questionId + "'>summary</a></td> </tr>");
        });
      }
    });
  };

  return ManageView;

})(Backbone.View);
