class SecondaryIndexCollection extends Backbone.Collection
  model: Result
  url: '/result'
  parse: (result) ->
    _.pluck result.rows, 'doc'

#  fetch: (options = {}) ->
#    unless options.include_docs?
#      options.include_docs = true
#    # I am using z to mark the end of the match
#    if options?.question
#      options.descending = "true"
## Note, this checks if isComplete is defined not if it is true
#      if options.isComplete?
#        options.startkey = options.question + ":" + options.isComplete + ":z"
#        options.endkey = options.question + ":" + options.isComplete
#      else
#        options.startkey = options.question + ":z"
#        options.endkey = options.question
##    console.log "options" + JSON.stringify options
#    super(options)


