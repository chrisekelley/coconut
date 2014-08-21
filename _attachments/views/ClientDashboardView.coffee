class ClientDashboardView extends Backbone.View
#  el: '#content table tbody'
#  el: ''
  tagName: 'tr'

  render: =>
    @$el.html "
    <td>#{@model.get "Gender"}</td>
    <td>#{@model.get "YearofBirth"}</td>
            "
