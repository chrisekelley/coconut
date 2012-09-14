(document) ->
  if document.MalariaCaseID
    emit document.lastModifiedAt, document.MalariaCaseID
