# Reporting from coconut

The data is stored in a JSON data store (CouchDB) and you write map/reduce queries to get data out of it in Javascript.
The actual assembly of the reports is done in Javascript & html.

I like to create temporary views in Futon to test out my javascript.

Example code in the map function textarea in Futon

    function(doc) {
    if (doc.question == 'Trichiasis Surgery') {
    if (doc.confirmed == "true") {
    if (doc.RefusedSurgery == 'true')  {
      emit(doc.createdAt.split(' ')[0].split('-')[1] + ' RefusedSurgery', 1)
    }
    if (doc.ProvidedEpilationConsultation == 'true')  {
      emit(doc.createdAt.split(' ')[0].split('-')[1] + ' ProvidedEpilationConsultation', 1)
    }
    // and so on...
    }
    }
    }

Enter "_sum" in the Reduce function textarea in Futon.

Check "Reduce" on the lower right panel to active the Reduce function. When you uncheck it you may view the record from
which each value/count comes from.

If you're viewing the raw json output, append "group=true" to the end of the url to activate the grouping.

I am teasing out the month part of each record's date (doc.createdAt.split(' ')[0].split('-')[1] ), and appending the name
of the value to it. This is used for aggregating the values for the report.

    {"rows":[

    {"key":"01 Azithromycin","value":3},

    {"key":"01 Azithromycin-R","value":3},

    {"key":"01 Silk","value":5},

    {"key":"01 Silk-L","value":3},

    {"key":"01 Silk-R","value":2},

    {"key":"01 Surgeries","value":3},

    {"key":"01 tetracyclineEyeOintment","value":3},

    {"key":"01 tetracyclineEyeOintment-R","value":3},

    {"key":"01 Trabut","value":5},

    {"key":"01 Trabut-L","value":3},

    {"key":"01 Trabut-R","value":2}

    ]}

#Some useful views:

byCollection_date

    function(doc) {
      emit(doc.collection + ":"+ doc.timestamp, doc);
    }

by_AdminDate

    function (doc) {
            emit(doc.savedBy + '|' + doc.lastModifiedAt);
    }

by_AdminRegistration

    function (doc) {
        if (doc.serviceUuid &&  doc.question == 'Admin Registration') {
            emit(doc.serviceUuid);
        }
    }

by_DocsDate

    function (doc) {
            emit(doc.lastModifiedAt);
    }
