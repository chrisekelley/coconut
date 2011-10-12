function(doc) {
	if(doc.department) {
		//emit(doc.assignedId, doc);
		// dates are stored in the doc as 'yyyy-mm-dd'
		//emit(doc.created.split('-'), {'x': doc.department, 'y': doc.resolved});
		//emit(doc.created, parseInt(doc.resolved));
		emit(doc.created.split('-'), 1);
	}
}