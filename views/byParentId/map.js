function(doc) {
  if(doc.parentId) {
    emit(doc.parentId, doc);
  }
}