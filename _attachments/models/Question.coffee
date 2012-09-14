class Question extends Backbone.Model
  type: -> @get("type")
  label: -> if @get("label")? then @get("label") else @get("id")
  repeatable: -> @get("repeatable")
  questions: -> @get("questions")
  value: -> if @get("value")? then @get("value") else ""
  required: -> if @get("required")? then @get("required") else "true"
  validation: -> if @get("validation")? then @get("validation") else null
  attributeSafeText: ->
    returnVal = if @get("label")? then @get("label") else @get("id")
    returnVal.replace(/[^a-zA-Z0-9]/g,"")

  url: "/question"

  set: (attributes) ->
    if attributes.questions?
      attributes.questions =  _.map attributes.questions, (question) ->
        new Question(question)
    attributes._id = attributes.id if attributes.id?
    super(attributes)

  loadFromDesigner: (domNode) ->
    result = Question.fromDomNode(domNode)
# TODO is this always going to just be the root question - containing only a name?
    if result.length is 1
      result = result[0]
      @set { id : result.id }
      for property in ["label","type","repeatable","required","validation"]
        attribute = {}
        attribute[property] = result.get(property)
        @set attribute
      @set {questions: result.questions()}
    else
      throw "More than one root node"

  resultSummaryFields: =>
    resultSummaryFields = @get("resultSummaryFields")
    if resultSummaryFields
      return resultSummaryFields
    else
      # If this hasn't been defined, default to first 3 fields if it has that many
      numberOfFields = Math.min(2,@questions().length-1)
      returnValue = {}
      _.each([0..numberOfFields], (index) =>
        returnValue[@questions()[index]?.label()] = "on"
      )
      return returnValue

  summaryFieldNames: =>
    return _.keys @resultSummaryFields()

  summaryFieldKeys: ->
    return _.map @summaryFieldNames(), (key) ->
      key.replace(/[^a-zA-Z0-9 -]/g,"").replace(/[ -]/g,"")

#Recursive
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
      for property in ["label","type","repeatable","select-options","radio-options","autocomplete-options","validation","required"]
        attribute = {}
        # Note that we are using find but the id property ensures a proper match
        propertyValue = question.find("##{property}-#{id}").val()
        propertyValue = String(question.find("##{property}-#{id}").is(":checked")) if property is "required"
        if propertyValue?
          attribute[property] = propertyValue
          result.set attribute

      if question.find(".question-definition").length > 0
        result.set {questions: Question.fromDomNode(question.children(".question-definition"))}
      return result
    .compact().value()

