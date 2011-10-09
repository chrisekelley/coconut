function(doc) {
  if (doc.flowId) {
	  emit(doc.flowId, doc);
  }
};
