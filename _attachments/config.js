//matchResults = document.location.pathname.match(/^\/(.*)\/_design\/(.*?)\//)

/** Configure the database based on current URL **/
//Backbone.couch_connector.config.db_name = matchResults[1]
//Backbone.couch_connector.config.ddoc_name = matchResults[2]
// If set to true, the connector will listen to the changes feed
// and will provide your models with real time remote updates.
// But in this case we enable the changes feed for each Collection on our own.
//Backbone.couch_connector.config.global_changes = false;
Backbone.Model.prototype.idAttribute = '_id';
Coconut = {};

matchResults = document.location.pathname.match(/^\/(.*)\/_design\/(.*?)\//);

if (matchResults === null) {
    console.log('Configuring for Pouchdb');
    Coconut.db_name = 'coconut';
    Coconut.ddoc_name = 'coconut';
} else {
    Coconut.db_name = matchResults[1];
    Coconut.ddoc_name = matchResults[2];
}

Backbone.sync = BackbonePouch.sync({
    db: PouchDB(Coconut.db_name)
});

function createDesignDoc(name, mapFunction) {
    var ddoc = {
        _id: '_design/' + name,
        views: {
        }
    };
    ddoc.views[name] = { map: mapFunction.toString() };
    return ddoc;
}

var designDoc = createDesignDoc('question_complete_index', function (doc) {
    if (doc.question) {
        console.log("doc.question: " + doc.question + " doc.complete: " + doc.complete);
//        if (doc.complete && doc.complete == 'true') {
//            emit(doc.question + ':true:' + doc.lastModifiedAt, null);
            emit(doc.question, null);
//        }
    }
});


//Backbone.sync.defaults.db.get('_design/question_complete_index', function(err, doc) {
//    Backbone.sync.defaults.db.remove(doc, function(err, response) { });
//    console.log("doc deleted: " + err);
//});

Backbone.sync.defaults.db.put(designDoc).then(function (doc) {
    // design doc created!
    console.log("question_complete_index created")
    Backbone.sync.defaults.db.query('question_complete_index', {stale: 'update_after'})
//    Backbone.sync.defaults.db.viewCleanup()
}).catch(function (err) {
    if (err.name === 'conflict') {
        console.log("question_complete_index exists.")
    }
});



//Backbone.sync.defaults.db.get('Individual Registration', function(err, otherDoc) {
//    otherDoc.collection = "question";
//    Backbone.sync.defaults.db.put(otherDoc, 'Individual Registration', otherDoc._rev, function(err, response) {
//        console.log("response: " + response);
//    });
//});
