class AdminCollection extends Backbone.Collection
  model: Result
  url: '/result'
  parse: (result) ->
#    adminId = Coconut.currentAdmin.get("_id")
#    nudocs = []
    docs = _.pluck result.rows, 'doc'
#    _.each docs, (doc) ->
#      if (doc.savedBy == adminId)
#        nudocs.push(doc)
#    return nudocs
    return docs

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

