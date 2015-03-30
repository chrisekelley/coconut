var DashboardLayout;

DashboardLayout = Backbone.Marionette.LayoutView.extend({
  template: JST["_attachments/templates/DashboardLayout.handlebars"],
  regions: {
    dashboardRegion: "#dashboard-region",
    contentRegion: "#content-region"
  }
});
