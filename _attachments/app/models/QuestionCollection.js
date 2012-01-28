var QuestionCollection,
  __hasProp = Object.prototype.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

QuestionCollection = (function(_super) {

  __extends(QuestionCollection, _super);

  function QuestionCollection() {
    QuestionCollection.__super__.constructor.apply(this, arguments);
  }

  QuestionCollection.prototype.model = "question";

  QuestionCollection.prototype.url = '/question';

  return QuestionCollection;

})(Backbone.Collection);
