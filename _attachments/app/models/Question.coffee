class Question extends Backbone.Model
  id: -> @get("id")
  type: -> @get("type")
  label: -> if @get("label")? then @get("label") else ""
  repeatable: -> @get("repeatable")
  questions: -> @get("questions")
  value: -> if @get("value")? then @get("value") else ""

  url: "/question"

  set: (attributes) ->
    if attributes.questions?
      attributes.questions =  _.map attributes.questions, (question) ->
        new Question(question)
    attributes._id = attributes.id if attributes.id?
    super(attributes)

  loadFromDesigner: (domNode) ->
    result = Question.fromDomNode(domNode)
    if result.length is 1
      result = result[0]
      @set { id : result.id }
      for property in ["label","type","repeatable"]
        attribute = {}
        attribute[property] = result.get(property)
        @set attribute
      @set {questions: result.questions()}
    else
      throw "More than one root node"

Question.fromDomNode = (domNode) ->
  _(domNode).chain()
    .map (question) ->
      question = $(question)
      id = question.attr("id")
      if question.children("#rootQuestionName").length > 0
        id = question.children("#rootQuestionName").val()
      return unless id
      result = new Question
      result.set { id : id }
      for property in ["label","type","repeatable"]
        attribute = {}
        # Note that we are using find but the id property ensures a proper match
        attribute[property] = question.find("##{property}-#{id}").val()
        result.set attribute
      if question.find(".question-definition").length > 0
        result.set {questions: Question.fromDomNode(question.children(".question-definition"))}
      return result
    .compact().value()

