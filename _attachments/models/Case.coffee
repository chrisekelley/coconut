class Case
  constructor: (options) ->
    @caseID = options?.caseID
    if options?.results
      @loadFromResultArray(options.results)

  loadFromResultArray: (results) ->
    @caseResults = results
    @questions = []
    this["Household Members"] = []
    @caseID = results[0].get "MalariaCaseID"
    _.each results, (result) =>
      if @caseID is not result.get "MalariaCaseID" then throw new Exception "Inconsistent Case ID"
      @questions.push result.get "question"
      if result.get("question") is "Household Members"
        this["Household Members"].push result.toJSON()
      else
        this[result.get "question"] = result.toJSON()

  fetch: (options) ->
    _.extend options,
      include_docs: "true"
      success: =>
        @loadFromResultArray(Coconut.ResultCollection.where
          MalariaCaseID: @caseID
        )
        options?.success()

    Coconut.ResultCollection ?= new ResultCollection()
    Coconut.ResultCollection.fetch
      options

  toJSON: =>
    returnVal = {}
    _.each @questions, (question) =>
      returnVal[question] = this[question]
    return returnVal

  deIdentify: (result) ->
    
  flatten: ->
    returnVal = {}
    _.each @toJSON(), (object,type) ->
      _.each object, (value, field) ->
        if _.isObject value
          _.each value, (arrayValue, arrayField) ->
            returnVal["#{type}-#{field}: #{arrayField}"] = arrayValue
        else
          returnVal["#{type}:#{field}"] = value
    returnVal

  LastModifiedAt: ->
    _.chain(@toJSON())
    .map (question) ->
      question.lastModifiedAt
    .max (lastModifiedAt) ->
      lastModifiedAt?.replace(/[- :]/g,"")
    .value()

  Questions: ->
    _.keys(@toJSON()).join(", ")

  MalariaCaseID: ->
    @caseID

  possibleQuestions: ->
    ["Case Notification", "Facility","Household","Household Members"]
  
  questionStatus: =>
    result = {}
    _.each @possibleQuestions(), (question) =>
      if question is "Household Members"
        result["Household Members"] = true
        _.each @["Household Members"]?, (member) ->
          result["Household Members"] = false if member.complete is "false"
      else
        result[question] = (@[question]?.complete is "true")
    return result
      
  complete: =>
    @questionStatus()["Household Members"] is true

  daysFromNotificationToCompletion: =>
    startTime = moment(@["Case Notification"].lastModifiedAt)
    completionTime = null
    _.each @["Household Members"], (member) ->
      completionTime = moment(member.lastModifiedAt) if moment(member.lastModifiedAt) > completionTime
    return completionTime.diff(startTime, "days")

  location: (type) ->
    WardHierarchy[type](@toJSON()["Case Notification"]?["FacilityName"])

  withinLocation: (location) ->
    return @location(location.type) is location.name
