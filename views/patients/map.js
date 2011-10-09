function(doc) {
  if(doc.forenames && doc.surname) {
    emit(doc.forenames, doc.surname);
  }
};