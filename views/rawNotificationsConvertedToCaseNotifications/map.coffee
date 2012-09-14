(document) ->
  if document.hf and document.hasCaseNotification
    emit document.date, null
