var HomeCompositeView;

HomeCompositeView = Backbone.Marionette.CompositeView.extend({
  childView: HomeRecordItemView,
  childViewContainer: '#records',
  template: JST["_attachments/templates/HomeView.handlebars"]
});
