matchResults = document.location.pathname.match(/^\/(.*)\/_design\/(.*?)\//)

/** Configure the database based on current URL **/
Backbone.couch_connector.config.db_name = matchResults[1]
Backbone.couch_connector.config.ddoc_name = matchResults[2]
// If set to true, the connector will listen to the changes feed
// and will provide your models with real time remote updates.
// But in this case we enable the changes feed for each Collection on our own.
Backbone.couch_connector.config.global_changes = false;
