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
