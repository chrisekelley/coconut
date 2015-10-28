var UserSearchResultCompositeView;

UserSearchResultCompositeView = Backbone.Marionette.CompositeView.extend({
  childView: UserSearchResultItemView,
  childViewContainer: '#userRecords',
  template: JST["_attachments/templates/UserSearchResultCompositeView.handlebars"]
});
