class ClientDashboardView extends Backbone.View
#  el: '#content table tbody'
#  el: ''
  tagName: 'p'

#  render: =>
#    @$el.html "
#    <td>#{@model.get "Gender"}</td>
#    <td>#{@model.get "YearofBirth"}</td>
#            "
  render: =>
    if !@model
      @$el.html polyglot.t("Error") + ": " + polyglot.t("NoClientLoaded") + "."
    else
      @$el.html polyglot.t(@model.get "Gender") + " " + polyglot.t(@model.get "DOB") + "<br>ID:" + @model.get "_id"

