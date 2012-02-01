class Result extends Backbone.Model
  url: "/result"

  question: ->
    return @get("question")

  toString: ->
    relevantKeys = _.difference (_.keys @toJSON()), [
      "_id"
      "_rev"
      "complete"
      "question"
      "collection"
    ]
    _.map relevantKeys, (key) =>
      result = @get(key)
      if typeof result == "object"
        result = JSON.stringify(result)
      result
    .join(" | ")
        
  toShortString: ->
    result = @toString()
    if result.length > 40 then result.substring(0,40) + "..." else result
