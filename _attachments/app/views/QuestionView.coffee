class QuestionView extends Backbone.View
  initialize: ->

  el: $('#content')

  render: => @el.html @toHTMLForm(@model)

  toHTMLForm: (questions = @model, groupId) ->
    # Need this because we have recursion later
    questions = [questions] unless questions.length?
    _.map(questions, (question) =>
      if question.repeatable() == "true" then repeatable = "<button>+</button>" else repeatable = ""
      if question.type()? and question.label()? and question.label() != ""
        name = question.label().replace(/[^a-zA-Z0-9 -]/g,"").replace(/[ -]/g,"")
        if question.repeatable() == "true"
          name = name + "[0]"
          question_id = question.id() + "-0"
        if groupId?
          name = "group.#{groupId}.#{name}"
        result = "
          <div class='question'>
          "
        unless question.type().match(/hidden/)
          result += "
            <label for='#{question_id}'>#{question.label()}</label>
          "
        if question.type().match(/textarea/)
          result += "
            <textarea name='#{name}' id='#{question_id}'>#{question.value()}</textarea>
          "
        else
          result += "
            <input name='#{name}' id='#{question_id}' type='#{question.type()}' value='#{question.value()}'></input>
          "
        result += "
          </div>
        "
        return result + repeatable
      else
        newGroupId = question_id
        newGroupId = newGroupId + "[0]" if question.repeatable()
        return "<div data-group-id='#{question_id}' class='question group'>" + @toHTMLForm(question.questions(), newGroupId) + "</div>" + repeatable
    ).join("")
