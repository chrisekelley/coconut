function(doc) {
	if(doc.department && doc.department === "4") {
		emit(doc.created.split('-'), 1);
	}
}