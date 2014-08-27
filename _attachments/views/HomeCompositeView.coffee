HomeCompositeView = Backbone.Marionette.CompositeView.extend
  childView: HomeRecordItemView,
  childViewContainer: '#records',
  template: JST["_attachments/templates/HomeView.handlebars"]
#    itemView : HomeRecordItemView,
#    itemViewContainer : '#records'


#    tagName: 'tr'
#    tagName: "table",
#    itemViewContainer : 'tbody',

#    events :
#      "click #nextLink"	  : "nextLink"
#
#    initialize : ->
#      this.listenTo this.collection, 'all', this.update