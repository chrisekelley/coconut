function(doc) {
  if (doc.formId === "incident") {
    emit([doc.lastModified], doc);
  }
};
