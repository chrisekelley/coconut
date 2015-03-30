function(head, req) {
  var row;
  start({
    "headers": {
      "Content-Type": "application/json"
     }
  });

  hashToInsureUniqueness = []
  uniqueResults = []
  while(row = getRow()) {
    if(row.value){
      // Use a regular expression that is case insensitive
      if(row.value.match(new RegExp(req.query.term,"i"))){
        if ( !hashToInsureUniqueness.hasOwnProperty(row.value) ) {
          hashToInsureUniqueness[ row.value ] = true;
          uniqueResults.push(row.value);
        }
      }
    }
  }

  send(JSON.stringify(uniqueResults));
}
