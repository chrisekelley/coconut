(document) ->
  if document.collection is "result"
    emit document.date, null
