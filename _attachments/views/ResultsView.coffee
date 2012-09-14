class ResultsView extends Backbone.View
  initialize: ->
    @question = new Question()

  el: '#content'

  render: =>
    # 3 options: edit partials, edit complete, create new
    @$el.html "
      <style>
        table.results th.header, table.results td{
          font-size:150%;
        }

      </style>

      <div class='not-complete' data-collapsed='false' data-role='collapsible'>
        <h2>'#{@question.id}' Items Not Completed (<span class='count-complete-false'></span>)</h2>
        <table class='results complete-false tablesorter'>
          <thead><tr>
            " + _.map(@question.summaryFieldNames(), (summaryField) ->
              "<th class='header'>#{summaryField}</th>"
            ).join("") + "
            <th></th>
          </tr></thead>
          <tbody>
          </tbody>
        </table>
        <a href='#new/result/#{escape(@question.id)}'>Add new '#{@question.id}'</a>
      </div>
      <div class='complete' data-role='collapsible'>
        <h2>'#{@question.id}' Items Completed (<span class='count-complete-true'></span>)</h2>
        <table class='results complete-true tablesorter'>
          <thead><tr>
            " + _.map(@question.summaryFieldNames(), (summaryField) ->
              "<th class='header'>#{summaryField}</th>"
            ).join("") + "
            <th></th>

          </tr></thead>
          <tbody>
          </tbody>
        </table>
      </div>
    "

    $("a").button()
    $('table').tablesorter()
    $('table').addTableFilter
      labelText: null
    $("input[type=search]").textinput()
    $('[data-role=collapsible]').collapsible()
    @loadIncompleteResults()
    $('.complete').bind "expand", =>
      @loadCompleteResults() unless $('.complete tr td').length > 0

    @updateCountComplete()

  updateCountComplete: ->
    results = new ResultCollection()
    results.fetch
      include_docs: false
      question: @question.id
      isComplete: true
      success: =>
        $(".count-complete-true").html results.length
  
  loadIncompleteResults: ->
    @loadResults(false)

  loadCompleteResults: ->
    @loadResults(true)

  loadResults: (complete) ->
    results = new ResultCollection()
    results.fetch
      include_docs: true
      question: @question.id
      isComplete: complete
      success: =>
        $(".count-complete-#{complete}").html results.length
        results.each (result,index) =>

          $("table.complete-#{complete} tbody").append "
            <tr>
              #{_.map(result.summaryValues(@question), (value) ->
                "<td><a href='#edit/result/#{result.id}'>#{value}</a></td>"
              ).join("")
              }
              <td><a href='#delete/result/#{result.id}' data-icon='delete' data-iconpos='notext'>Delete</a></td>
            </tr>
          "
  
          if index+1 is results.length
            $("table a").button()
            $("table").trigger("update")
          _.each $('table tr'), (row, index) ->
            $(row).addClass("odd") if index%2 is 1

