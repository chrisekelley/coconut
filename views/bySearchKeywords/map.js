function(doc) {
	if(doc.assignedId) {
		emit(doc.assignedId, doc);
	}
	if(doc.phone) {
		emit(doc.phone, doc);
	}
}