HomeView = Backbone.Marionette.ItemView.extend
#  el: '#content table tbody'
#  el: '#content'
  template: JST["_attachments/templates/HomeView.handlebars"]

  addOne : (result) ->
    recordView = new HomeRecordView  {model:result}
    if typeof result.get('question') == 'undefined'
      console.log("skipping this result.")
      return
    if result.get('question') == 'Admin Registration'
      console.log("skipping this result.")
      return
#    this.rendered = this.view.render().el
    rendered = recordView.render()
    $("#records tbody").append(rendered)

#  render: =>
#    @$el.html "
#                <table id=\"dashboard\"></table>
#                <table id=\"records\" class='summary tablesorter'>
#                <thead><tr>
#                  <th>Question</th>
#                  <th>User</th>
#                  <th>Last Modified</th>
#                </tr></thead>
#                <tbody>
#                </tbody>
#              </table>
#        "
#    dashboard = new ClientDashboardView {model: Coconut.homeView.client}
#    renderedDash = dashboard.render()
#    $("#dashboard").append(renderedDash)
#    Coconut.homeView.results.each @addOne
##    $('select').selectmenu()
