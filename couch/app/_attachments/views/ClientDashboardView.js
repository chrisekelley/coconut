var ClientDashboardView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ClientDashboardView = (function(superClass) {
  extend(ClientDashboardView, superClass);

  function ClientDashboardView() {
    this.render = bind(this.render, this);
    return ClientDashboardView.__super__.constructor.apply(this, arguments);
  }

  ClientDashboardView.prototype.tagName = 'p';

  ClientDashboardView.prototype.render = function() {
    if (!this.model) {
      return this.$el.html(polyglot.t("Error") + ": " + polyglot.t("NoClientLoaded") + ".");
    } else {
      return this.$el.html(polyglot.t(this.model.get("Gender")) + " " + polyglot.t(this.model.get("DOB")) + "<br>ID:" + this.model.get("_id"));
    }
  };

  return ClientDashboardView;

})(Backbone.View);
