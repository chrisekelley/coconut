function(doc) {
	if(doc.assignedId) {
		emit(doc.assignedId, doc);
	}
}