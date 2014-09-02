class ClientDashboardView extends Backbone.View
#  el: '#content table tbody'
#  el: ''
  tagName: 'tr'

#  render: =>
#    @$el.html "
#    <td>#{@model.get "Gender"}</td>
#    <td>#{@model.get "YearofBirth"}</td>
#            "
  render: =>
    @$el.html "<p>#{@model.get "Gender"} #{@model.get "DOB"}</p>"
