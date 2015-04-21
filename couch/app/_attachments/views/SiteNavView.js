var SiteNavView;

SiteNavView = Backbone.Marionette.ItemView.extend({
  template: JST["_attachments/templates/SiteNavView.handlebars"],
  events: {
    "click .nav a": "toggle"
  },
  toggle: (function(_this) {
    return function() {
      return $(".navbar-toggle").click();
    };
  })(this)
});
