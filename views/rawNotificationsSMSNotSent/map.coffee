(document) ->
  if document.hf and (not document.SMSSent)
    emit document.date, null
