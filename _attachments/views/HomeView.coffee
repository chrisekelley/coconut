class HomeView extends Backbone.View
#  el: '#content table tbody'
  el: '#content'

  addOne : (result) ->
    recordView = new HomeRecordView  {model:result}
#    this.rendered = this.view.render().el
    rendered = recordView.render()
    $("#content table tbody").append(rendered)

  render: =>
    @$el.html "
              <table class='summary tablesorter'>
                <thead><tr>
                  <th>Question</th>
                  <th>User</th>
                  <th>Last Modified</th>
                </tr></thead>
                <tbody>
                </tbody>
              </table>
        "
    Coconut.homeView.results.each @addOne
