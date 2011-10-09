function(doc) {
  if(doc.patientId) {
    emit(doc.patientId, doc);
  }
}