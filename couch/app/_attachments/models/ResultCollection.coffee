class ResultCollection extends Backbone.Collection
  model: Result
  url: '/result'
  parse: (result) ->
    _.pluck result.rows, 'value'


  fetch: (options = {}) ->
    unless options.include_docs?
      options.include_docs = true
    # I am using z to mark the end of the match
    if options?.question
      options.descending = "true"
# Note, this checks if isComplete is defined not if it is true
      if options.isComplete?
        options.startkey = options.question + ":" + options.isComplete + ":z"
        options.endkey = options.question + ":" + options.isComplete
      else
        options.startkey = options.question + ":z"
        options.endkey = options.question
#    console.log "options" + JSON.stringify options
    super(options)

  notSent: ->
    @.filter (result) ->
     not result.get("sentTo")?.length

  filteredByQuestionCategorizedByStatus: (questionType) ->
    returnObject = {}
    returnObject.complete = []
    returnObject.notCompete = []
    @each (result) ->
      return unless result.get("question") is questionType
      switch result.get("complete")
        when true
          returnObject.complete.push(result)
        else
          returnObject.notComplete.push(result)
          
    return returnObject

  filterByQuestionType: (questionType) ->
    @filter (result) ->
      return result.get("question") is questionType

  partialResults: (questionType) ->
    @filter (result) ->
      return result.get("question") is questionType and not result.complete()
