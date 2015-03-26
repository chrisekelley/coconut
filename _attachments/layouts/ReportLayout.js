var ReportLayout;

ReportLayout = Backbone.Marionette.LayoutView.extend({
  template: JST["_attachments/templates/ReportLayout.handlebars"],
  regions: {
    reportHeaderRegion: "#report-header-region",
    reportListingRegion: "#report-listing-region"
  }
});
