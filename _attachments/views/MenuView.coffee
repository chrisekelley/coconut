class MenuView extends Backbone.View

  el: '.question-buttons'

  events:
    "change" : "render"


  render: =>
    @$el.html "
      <div id='navbar' data-role='navbar'>
        <ul></ul>
      </div>
    "

    Coconut.questions.fetch
      success: =>

        @$el.find("ul").html(Coconut.questions.map (question,index) ->
          "<li><a id='menu-#{index}' href='#show/results/#{escape(question.id)}'><h2>#{question.id}<div id='menu-partial-amount'></div></h2></a></li>"
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

    $.ajax "app/version",
      success: (result) ->
        $("#version").html result
      error:
        $("#version").html "-"
