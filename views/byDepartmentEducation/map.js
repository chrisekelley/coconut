function(doc) {
	if(doc.department && doc.department === "3") {
		emit(doc.created.split('-'), 1);
	}
}