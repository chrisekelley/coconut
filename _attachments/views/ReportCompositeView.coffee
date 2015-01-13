ReportCompositeView = Backbone.Marionette.CompositeView.extend
  childView: ReportRecordItemView,
  childViewContainer: '#records',
  template: JST["_attachments/templates/ReportView.handlebars"]
