class MenuView extends Backbone.View

  el: $('#menu')

  render: =>
    @el.html "
      <span class='questions'>
      </span>
      <span class='otherNavigation'>
        <a href='#manage'>Manage</a>
        <a href='#logout'>Logout</a>
      </span>
    "

    Coconut.questions.fetch
      success: =>
        questionLinks = Coconut.questions.map (question) ->
            "<a href='#show/results/#{question.id}'>#{question.id}</a>"
        .join(" ")
        @el.find(".questions").html questionLinks
