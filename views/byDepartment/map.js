function(doc) {
	if(doc.department) {
		emit(doc.department, doc);
	}
}