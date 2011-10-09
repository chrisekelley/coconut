function(doc) {
	if(doc.surname) {
		emit(doc.surname, doc);
	}
	if(doc.country_id_number) {
		emit(doc.country_id_number, doc);
	}
}