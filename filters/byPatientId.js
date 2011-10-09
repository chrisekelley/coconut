function(doc, req) {
	console.log("req: " + req);
  // only send notifications to the recipient
  if (doc.patientId == req.query.patientId)
    return true;
  else
    return false;
};