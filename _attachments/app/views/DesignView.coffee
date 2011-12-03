class DesignView extends Backbone.View
  initialize: ->

  el: $('#content')

  render: =>
    templateData = {}
    templateData.types = @questionTypes
    $("#content").html(this.template(templateData))

  template: Handlebars.compile "
    <style>
      .question-definition{
        border-style: dotted;
        border-width: 1px;
        margin: 10px;
        margin-top: 30px;
      }
      .question-definition-controls{
        float: right;
      }
      .group{
        border-style: dotted;
        border-width: 1px;
      }
    </style>
    <select id='element_selector'>
      {{#each types}}
        <option>{{this}}</option>
      {{/each}}
    </select>
    <button>Add</button>
    <div id='questions'>
    </div>
    <button>Render</button>
    <form id='render'></form>
    <button>FormDump</button>
    <button>Dump</button>
    <textarea id='dump' style='width:100px;height:100px'></textarea>
    <form>
      <input name='name' type='text'></input>
      <input name='1[0].drug' type='text'></input>
      <input name='1[0].date' type='text'></input>
      <input name='1[1].drug' type='text'></input>
      <input name='1[1].date' type='text'></input>
    </form>
  "

  questionTypes: ["text","number","date","datetime", "textarea", "hidden"]

  events:
    "click button:contains(Add)": "add"
    "click button:contains(Group)": "groupClick"
    "click button:contains(Ungroup)": "ungroupClick"
    "click button:contains(X)": "deleteClick"
    "click button:contains(@)": "toggleRepeatable"
    "click button:contains(Dump)" : "dump"
    "click button:contains(FormDump)" : "formDump"
    "click button:contains(Render)" : "renderForm"
    "click button:contains(+)" : "repeat"

  add: (event) ->
    type = $(event.target).prev().val()
    id = Math.ceil(Math.random()*1000)
    if $("#questions").children().length > 0
      $("#questions").append "
        <button>Group</button>
      "
    $("#questions").append "
      <div data-repeat='false' class='question-definition' id='#{id}'>
        <div class='question-definition-controls'>
          <button>@</button>
          <input type='hidden' id=repeatable-#{id} value='false'></input>
          <button>X</button>
        </div>
        <div>Type: #{type}</div>
        <label for='label-#{id}'>Label</label>
        <input type='text' name='label-#{id}' id='label-#{id}'></input>
        <input type='hidden' name='type-#{id}' id='type-#{id}' value='#{type}'></input>
        <input type='hidden' name='required-#{id}' value='false'></input>
      </div>
    "

  groupClick: (event) ->
    groupDiv = $(event.target)
    @group(groupDiv.prev(), groupDiv.next())
    groupDiv.remove()

  group: (group1,group2) ->
    for group in [group1,group2]
      if group.attr("repeat") == "false" and group.children(".question-definition").length() > 0
        @ungroup(group)
    id = Math.ceil(Math.random()*1000)
    group1.add(group2).wrapAll "
      <div data-repeat='false' class='question-definition' id='#{id}'>
        <div class='question-definition-controls'>
          <button>@</button>
          <input type='hidden' id=repeatable-#{id} value='false'></input>
          <button>Ungroup</button>
          <button>X</button>
        </div>
      </div>
    "

  ungroupClick: (event) ->
    controls = $(event.target).parent()
    @ungroup controls

  ungroup: (itemInGroup) ->
    controls = itemInGroup.parent().children(".question-definition-controls")
    firstQuestionDefinition = itemInGroup.parent().children(".question-definition").first()
    itemInGroup.unwrap()
    controls.remove()
    firstQuestionDefinition.after "
      <button>Group</button>
    "
    itemInGroup

  deleteClick: (event) ->
    @deleteQuestion($(event.target).parent().parent(".question-definition"))


  deleteQuestion: (question) ->
    surroundingQuestion = question.parent(".question-definition")
    if surroundingQuestion.children(".question-definition").length == 2
      @ungroup(question)

    # Remove Group/Ungroup buttons
    if question.next("button").length == 1
      question.next("button").remove()
    else
      question.prev("button").remove()

    # Removes the question-definition div
    question.remove()


  toggleRepeatable: (event) ->
    button = $(event.target)
    hiddenRepeatableInputElement = button.next()
    if hiddenRepeatableInputElement.val() == "false"
      button.attr("style",'color:green')
      hiddenRepeatableInputElement.val("true")
    else
      button.attr("style",'color:red')
      hiddenRepeatableInputElement.val("false")

  questions: ->
    return $('#questions').children()

  toJson: ->
    return Question.toJSON @questions()

  toObject: ->
    return Question.toObject @questions()

  toHTMLForm: ->
    return Question.toHTMLForm(@toObject())

  dump: ->
    $('#dump').html(@toJson())

  renderForm: ->
    $('#render').html(@toHTMLForm())

  formDump: ->
    $('#dump').html(JSON.stringify($('form').toObject()))

  repeat: (event) ->
    button = $(event.target)
    newQuestion = button.prev(".question").clone()
    questionID = newQuestion.attr("data-group-id")
    questionID = "" unless questionID?

    # Fix the indexes
    for inputElement in newQuestion.find("input")
      inputElement = $(inputElement)
      name = inputElement.attr("name")
      re = new RegExp("#{questionID}\\[(\\d)\\]")
      newIndex = parseInt(_.last(name.match(re))) + 1
      inputElement.attr("name", name.replace(re,"#{questionID}[#{newIndex}]"))

    button.after(newQuestion.add(button.clone()))
    button.remove()

class Question

Question.toJSON = (questions) ->
  return JSON.stringify(Question.toObject(questions))

Question.toObject = (questions) ->
  _(questions).chain()
    .map (question) ->
      question = $(question)
      id = question.attr("id")
      return unless id
      result = { id : id }
      for property in ["label","type","repeatable"]
        result[property] = question.find("##{property}-#{id}").val()
      if question.find(".question-definition").length > 0
        result.questions = Question.toObject(question.find(".question-definition"))
      return result
    .compact().value()

Question.toHTMLForm = (questions, groupId) ->
  _.map(questions, (question) ->
    if question.repeatable == "true" then repeatable = "<button>+</button>" else repeatable = ""
    if question.type? and question.label? and question.label != ""
      name = question.label.replace(/[^a-zA-Z0-9 -]/g,"").replace(/[ -]/g,"")
      if question.repeatable == "true"
        name = name + "[0]"
        question.id = question.id + "-0"
      if groupId?
        name = "group.#{groupId}.#{name}"
      result = "
        <div class='question'>
          <label for='#{question.id}'>#{question.label}</label>
          <input name='#{name}' id='#{question.id}' type='#{question.type}'></input>
        </div>
      "
      return result + repeatable
    else
      newGroupId = question.id
      newGroupId = newGroupId + "[0]" if question.repeatable
      return "<div data-group-id='#{question.id}' class='question group'>" + Question.toHTMLForm(question.questions, newGroupId) + "</div>" + repeatable
  ).join("")
