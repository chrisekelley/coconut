function(doc) {
	if(doc.department && doc.department === "2") {
		emit(doc.created.split('-'), 1);
	}
}