var ClientDashboardView,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

ClientDashboardView = (function(superClass) {
  extend(ClientDashboardView, superClass);

  function ClientDashboardView() {
    this.badScan = bind(this.badScan, this);
    this.render = bind(this.render, this);
    return ClientDashboardView.__super__.constructor.apply(this, arguments);
  }

  ClientDashboardView.prototype.tagName = 'p';

  ClientDashboardView.prototype.events = {
    "click #badScan": "badScan"
  };

  ClientDashboardView.prototype.render = function() {
    if (!this.model) {
      return this.$el.html(polyglot.t("Error") + ": " + polyglot.t("NoClientLoaded") + ".");
    } else {
      return this.$el.html(polyglot.t(this.model.get("Gender")) + " " + polyglot.t(this.model.get("DOB")) + "<a data-role='button' class='btn btn-danger btn-sm' style='margin:15px' id='badScan'>" + polyglot.t("badScan") + "</a>" + "<br>ID:" + this.model.get("_id"));
    }
  };

  ClientDashboardView.prototype.badScan = function() {
    var log;
    console.log("badScan");
    Coconut.badScanId = this.model.get("_id");
    log = new Log();
    log.save({
      title: "Bad Scan",
      modelId: Coconut.badScanId,
      serviceUuid: serviceUuid,
      currentPrints: Coconut.currentPrints,
      currentDistrict: Coconut.currentDistrict,
      currentAdmin: Coconut.currentAdmin
    }, {
      success: (function(_this) {
        return function() {
          $("#message").append("<br/>Saved log about problem.");
          return console.log("Saved log about problem.");
        };
      })(this)
    }, {
      error: (function(_this) {
        return function(model, err, cb) {
          return console.log(JSON.stringify(err));
        };
      })(this)
    });
    Coconut.trigger("badScan");
  };

  return ClientDashboardView;

})(Backbone.View);
