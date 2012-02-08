class ResultsView extends Backbone.View
  initialize: ->
    @question = new Question()

  el: $('#content')

  render: =>

    @el.html @template(@question.attributes)

    # 3 options: edit partials, edit complete, create new
    Coconut.resultCollection ?= new ResultCollection()
    Coconut.resultCollection.fetch
      success: =>
        Coconut.resultCollection.each (result) =>
          result.fetch
            success: =>
              return unless result.question() is @question.id
              if result.get("complete") is true
                $("table.complete tbody").append(rowTemplate(result))
              else
                $("table.notComplete tbody").append(rowTemplate(result))

  template: Handlebars.compile "
    <h1>{{id}}</h1>
    <a href='#new/result/{{id}}'>Start new result</a>
    <h2>Partial Results</h2>
    <table class='notComplete'>
      <thead><tr>
        <th>Name</th>
        <th></th>
        <th></th>
      </tr></thead>
      <tbody>
      </tbody>
    </table>
    <h2>Complete Results</h2>
    <table class='complete'>
      <thead><tr>
        <th>Name</th>
        <th></th>
        <th></th>
      </tr></thead>
      <tbody>
      </tbody>
    </table>
  "

  rowTemplate = Handlebars.compile "
    <tr>
      <td>{{toShortString}}</td>
      <td><a href='#edit/result/{{id}}'>Edit</a></td>
      <td><a href='#view/result/{{id}}'>View</a></td>
    </tr>
  "
