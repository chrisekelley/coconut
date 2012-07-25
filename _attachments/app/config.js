var FORMY = {};
/** Configure the database **/
FORMY.SyncpointLocalDb = null;
findSyncpointLocalDb();
	Backbone.couch_connector.config.ddoc_name = "coconut";
if (FORMY.SyncpointLocalDb == null) {
	Backbone.couch_connector.config.db_name = "coconut";
} else {
	console.log("FORMY.SyncpointLocalDb: " + FORMY.SyncpointLocalDb);
	Backbone.couch_connector.config.db_name = FORMY.SyncpointLocalDb;
}
// If set to true, the connector will listen to the changes feed
// and will provide your models with real time remote updates.
// But in this case we enable the changes feed for each Collection on our own.
Backbone.couch_connector.config.global_changes = false;

//This allows us to have separate template files
var loadTemplate = function(filename){
	//console.log("filename in config: " + filename);
var templateFunction;
$.ajax("app/templates/" + filename,{
  async:false, // make sure we pause execution until this template is loaded
  success: function(result){
	  //console.log("result: " + result);
    templateFunction = Handlebars.compile(result);
  }
});
    // console.log("templateFunction: " + templateFunction);
return templateFunction;
};
//var supportsOrientationChange = "onorientationchange" in window,
//orientationEvent = supportsOrientationChange ? "orientationchange" : "resize";
