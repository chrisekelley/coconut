class ResultCollection extends Backbone.Collection
  model: Result
  url: '/result'

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
