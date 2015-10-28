UserSearchResultCompositeView = Backbone.Marionette.CompositeView.extend
#  id: 'userRecords'
#  className:'table table-striped'
#  tagName: 'table'
#  attributes: ()->
#    "id": 'userRecords'
  childView: UserSearchResultItemView
  childViewContainer: '#userRecords',
#  className: "table table-striped"
  template: JST["_attachments/templates/UserSearchResultCompositeView.handlebars"]

