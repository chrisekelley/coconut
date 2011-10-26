function(doc) {
	if(doc.department && ((doc.department < "3") || (doc.department > "5"))) {
		emit(doc.created.split('-'), 1);
	}
}