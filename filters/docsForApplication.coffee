(doc, req) ->
  # Filters on documents with attachments seems to fail
  #if (doc.collection is 'question' or doc.collection is 'user' or doc._id is '_design/zanzibar')
  if (doc.collection is 'question' or doc.collection is 'user')
    return true
  else
    return false
