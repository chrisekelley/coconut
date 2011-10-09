function(doc) {
  if (doc.flowId === "9") {
    emit([doc.lastModified], doc);
  }
};
