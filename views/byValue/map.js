function(doc) {
  for(value in doc)
    if(value.indexOf("_") != 0 && value != "collection" && value != "complete" && value != "couchapp")
      emit(value,doc[value]);
}
