function(doc) {
	if(doc.department && doc.department === "5") {
		emit(doc.created.split('-'), 1);
	}
}