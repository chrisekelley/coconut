var ReportHeaderDashboardView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ReportHeaderDashboardView = (function(superClass) {
  extend(ReportHeaderDashboardView, superClass);

  function ReportHeaderDashboardView() {
    this.render = bind(this.render, this);
    return ReportHeaderDashboardView.__super__.constructor.apply(this, arguments);
  }

  ReportHeaderDashboardView.prototype.tagName = 'p';

  ReportHeaderDashboardView.prototype.render = function() {
    return this.$el.html('<h2>' + polyglot.t("Report1Name") + '<h2>');
  };

  return ReportHeaderDashboardView;

})(Backbone.View);
