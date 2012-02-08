class Result extends Backbone.Model
  url: "/result"

  question: ->
    return @get("question")

  toString: ->
    question = new Question
      id: @question()
    question.fetch
      success: =>
        relevantKeys = []
        if question.get("resultSummaryFields")?
          relevantKeys = _.keys question.get("resultSummaryFields")
          relevantKeys = _.map relevantKeys, (key) ->
            key.replace(/[^a-zA-Z0-9 -]/g,"").replace(/[ -]/g,"")
        else
          relevantKeys = _.difference (_.keys @toJSON()), [
            "_id"
            "_rev"
            "complete"
            "question"
            "collection"
          ]
        _.map relevantKeys, (key) =>
          console.log key
          console.log @get(key)
          result = @get(key) || ""
          if typeof result == "object"
            result = JSON.stringify(result)
          result
        .join(" | ")
        
  toShortString: ->
    result = @toString()
    if result.length > 40 then result.substring(0,40) + "..." else result
