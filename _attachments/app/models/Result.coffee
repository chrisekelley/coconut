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
      @get(key)
    .join(" | ")
        
  toShortString: ->
    result = @toString()
    if result.length > 20 then result.substring(0,20) + "..." else result
