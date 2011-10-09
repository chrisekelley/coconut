function(doc, req){
	  if(doc.formId && req.query &&req.query.formId && doc.formId == req.query.formId) // does the formId match?
		    return true;
		  else if (req.query && req.query.formId && doc._deleted) // has the document been deleted?
		    return true;
		  else // do nothing
		    return false;
		}