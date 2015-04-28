class Result extends Backbone.Model
  initialize: ->
    unless this.attributes.createdAt
      @set
        collection: 'result'
        createdAt: moment(new Date()).format(Coconut.config.get "datetime_format")
    unless this.attributes.lastModifiedAt
      @set
        lastModifiedAt: moment(new Date()).format(Coconut.config.get "datetime_format")

  url: "/result"

  question: ->
    return @get("question")

  tags: ->
    tags = @get("Tags")
    return tags.split(/, */) if tags?
    return []

  complete: ->
    return true if _.include(@tags(), "complete")
    complete = @get("complete")
    complete = @get("Complete") if typeof complete is "undefined"
    return false if complete is null or typeof complete is "undefined"
    return true if complete is true or complete.match(/true|yes/)

  shortString: ->
    # see ResultsView.coffee to see @string get set
    result = @string
    if result.length > 40 then result.substring(0,40) + "..." else result

  summaryKeys: (question) ->
          
    relevantKeys = question.summaryFieldKeys()
    if relevantKeys.length is 0
      relevantKeys = _.difference (_.keys @toJSON()), [
        "_id"
        "_rev"
        "complete"
        "question"
        "collection"
      ]

    return relevantKeys

  summaryValues: (question) ->
    return _.map @summaryKeys(question), (key) =>
      returnVal = @get(key) || ""
      if typeof returnVal is "object"
        returnVal = JSON.stringify(returnVal)
      returnVal

  get: (attribute) ->
    original = super(attribute)
    # Used to encrypt identifiable information in cloud mode
    if original? and Coconut.config.local.get("mode") is "cloud"
      identifyingAttributes = Coconut.config.get "identifying_attributes"
      if identifyingAttributes? and _.contains(identifyingAttributes, attribute)
        return b64_sha1(original)

    return original

  toJSON: ->
    json = super()
    if Coconut.config.local.get("mode") is "cloud"
      _.each json, (value, key) =>
        if value? and _.contains(@identifyingAttributes, key)
          json[key] = b64_sha1(value)

    return json

  save: (key,value,options) ->
    @set
#      user: $.cookie('current_user')
      lastModifiedAt: moment(new Date()).format(Coconut.config.get "date_format")
    super(key,value,options)
