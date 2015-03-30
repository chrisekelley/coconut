class ManageView extends Backbone.View

  el: '#content'

  render: =>
    @$el.html "
      <a data-role='button' class='btn btn-primary btn-lg' href='#sync'>Sync</a>
      <a data-role='button' class='btn btn-primary btn-lg' href='#configure'>Set cloud vs mobile</a>
      <!-- a href='#users'>Manage users</a -->
      <!-- a href='#messaging'>Send message to users</a -->
      <h2>Question Sets</h2>
      <a href='#design'>New</a>
      <table style='width:100%'>
        <thead>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
        </thead>
        <tbody>
        </tbody>
      </table>
    "
#    $("a").button()
    Coconut.questions.fetch
      success: ->
        Coconut.questions.each (question) ->
          questionName = question.id
          questionId = escape(question.id)
          $("tbody").append "
            <tr>
              <td>#{questionName}</td>
              <td><a href='#edit/#{questionId}'>edit</a></td>
              <td><a href='#delete/#{questionId}'>delete</a></td>
              <td><a href='#edit/resultSummary/#{questionId}'>summary</a></td>
            </tr>
          "
#        $("table a").button()
