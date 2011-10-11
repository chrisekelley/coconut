function(doc) {
	if(doc.assignedId) {
		//emit(doc.assignedId, doc);
		// dates are stored in the doc as 'yyyy-mm-dd'
		emit(doc.created.split('-'), parseInt(doc.resolved));
		//emit(doc.created, parseInt(doc.resolved));
	}
}