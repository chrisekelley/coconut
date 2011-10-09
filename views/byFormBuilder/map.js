function(doc) {
  if (doc.formBuilder) {
	  emit(doc._id, doc);
  }
};
