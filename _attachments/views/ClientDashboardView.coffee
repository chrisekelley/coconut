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
      @$el.html "No client loaded."
    else
      @$el.html "#{@model.get "Gender"} #{@model.get "DOB"}"