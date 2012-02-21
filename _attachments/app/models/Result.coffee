class Result extends Backbone.Model
  url: "/result"

  question: ->
    return @get("question")

  tags: ->
    tags = @get("tags")
    return tags.split(/, */) if tags?
    return []

  complete: ->
    _.include(@tags(), "complete")

  shortString: ->
    # see ResultsView.coffee to see @string get set
    result = @string
    if result.length > 40 then result.substring(0,40) + "..." else result
