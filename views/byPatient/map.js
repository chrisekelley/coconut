function(doc, req){
	  if(doc._id && req.query &&req.query.formId && doc._id == req.query._id) // does the _id match?
		    return true;
		  else if (req.query && req.query._id && doc._deleted) // has the document been deleted?
		    return true;
		  else // do nothing
		    return false;
		}