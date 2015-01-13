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

Coconut.languages = ["en","pt"]

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

var designDocOld = createDesignDoc('by_clientId', function (doc) {
//    if (doc.question) {
//        console.log("doc.question: " + doc.question + " doc.complete: " + doc.complete);
//        if (doc.complete && doc.complete == 'true') {
//            emit(doc.question + ':true:' + doc.lastModifiedAt, null);
            emit(doc.savedBy);
//        }
//    }
});

var byClientIdDesignDoc = createDesignDoc('by_clientId', function (doc) {
    if (doc.clientId) {
        emit(doc.clientId);
    }
});

var byServiceUuidDesignDoc = createDesignDoc('by_serviceUuid', function (doc) {
    if (doc.serviceUuid && (doc.question == 'Individual Registration' || doc.question == 'Admin Registration')) {
        emit(doc.serviceUuid);
    }
});

var by_AdminRegistrationDesignDoc = createDesignDoc('by_AdminRegistration', function (doc) {
    if (doc.serviceUuid &&  doc.question == 'Admin Registration') {
        emit(doc.serviceUuid);
    }
});

var by_QuestionSortableByDateDesignDoc = createDesignDoc('by_QuestionSortableByDate', function(document) {
    //return emit(document.question + '|' + document.lastModifiedAt, null);
    return emit( document.lastModifiedAt);
});

var by_QIndivRegistrationDesignDoc = createDesignDoc('by_AdminRegistration', function(document) {
    if (doc.question == 'Individual Registration') {
        emit(doc.serviceUuid);
    }
});

//Backbone.sync.defaults.db.get('_design/by_clientId', function(err, doc) {
//    Backbone.sync.defaults.db.remove(doc, function(err, response) { });
//    console.log("doc deleted: " + err);
//});

Backbone.sync.defaults.db.put(byClientIdDesignDoc).then(function (doc) {
    // design doc created!
    console.log("by_clientId created")
    Backbone.sync.defaults.db.query('by_clientId', {stale: 'update_after'})
//    Backbone.sync.defaults.db.viewCleanup()
}).catch(function (err) {
    if (err.name === 'conflict') {
        console.log("by_clientId exists.")
    }
});

Backbone.sync.defaults.db.put(byServiceUuidDesignDoc).then(function (doc) {
    // design doc created!
    console.log("by_serviceUuid created")
    Backbone.sync.defaults.db.query('by_serviceUuid', {stale: 'update_after'})
//    Backbone.sync.defaults.db.viewCleanup()
}).catch(function (err) {
    if (err.name === 'conflict') {
        console.log("by_serviceUuid exists.")
    }
});

Backbone.sync.defaults.db.put(by_AdminRegistrationDesignDoc).then(function (doc) {
    // design doc created!
    console.log("by_AdminRegistration created")
    Backbone.sync.defaults.db.query('by_AdminRegistration', {stale: 'update_after'})
//    Backbone.sync.defaults.db.viewCleanup()
}).catch(function (err) {
    if (err.name === 'conflict') {
        console.log("by_AdminRegistration exists.")
    }
});

Backbone.sync.defaults.db.put(by_QuestionSortableByDateDesignDoc).then(function (doc) {
    // design doc created!
    console.log("by_QuestionSortableByDate created")
    Backbone.sync.defaults.db.query('by_QuestionSortableByDate', {stale: 'update_after'})
//    Backbone.sync.defaults.db.viewCleanup()
}).catch(function (err) {
    if (err.name === 'conflict') {
        console.log("by_QuestionSortableByDate exists.")
    }
});

//Backbone.sync.defaults.db.get('Individual Registration', function(err, otherDoc) {
//    otherDoc.collection = "question";
//    Backbone.sync.defaults.db.put(otherDoc, 'Individual Registration', otherDoc._rev, function(err, response) {
//        console.log("response: " + response);
//    });
//});
