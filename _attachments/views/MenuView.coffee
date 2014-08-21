class MenuView extends Backbone.View

  el: '.question-buttons'

  events:
    "change" : "render",
    "change #select-choice-0": "goto"

  goto: (e) ->
    form = $('#select-choice-0').val();
    if (form != '')
      if form == 'home'
        url = '#'
      else
        url = '#new/result/' + escape(form)
      window.location.href=url;

  render: =>
    @$el.html "
    <select name=\"select-choice-0\" id=\"select-choice-0\">
    <option value=''>Select</option>
    <option value='home'>Home</option>
    </select>
        "
    $('select').selectmenu()

    Coconut.questions.fetch
      fetch: 'query',
      options:
        query:
          fun:QUERIES.byQuestion
      success: =>
        @$el.find("#select-choice-0").append(Coconut.questions.map (question,index) ->
#          "<li><a id='menu-#{index}' href='#show/results/#{escape(question.id)}'><h2>#{question.id}<div id='menu-partial-amount'></div></h2></a></li>"
          "<option value='#{question.id}'>#{question.id}</option>"
        .join(" "))
        $(".question-buttons").navbar()
        @update()

  update: ->
    Coconut.questions.each (question,index) =>
      results = new ResultCollection()
      results.fetch
        include_docs: false
        question: question.id
        isComplete: false
        success: =>
          $("#menu-#{index} #menu-partial-amount").html results.length

    $.ajax "version",
      success: (result) ->
        $("#version").html result
      error:
        $("#version").html "-"
