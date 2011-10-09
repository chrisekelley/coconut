Coconut renders json defined forms in a browser and then saves the results to couchdb.
=========================================================================================

Instructions
------------

You will need [couchdb](http://couchdb.apache.org/) to make it run:

    apt-get install couchdb

The first time you push the couch, the coconut db will be created for you. You can also create a new database using futon, the handy couchdb GUI by clicking here: [futon on localhost](http://localhost:5984/_utils), or by running this curl command:

    curl -X PUT http://localhost:5984/coconut

To get Coconut working you need to put the files in this directory into a couchdb database. You can accomplish this by using the
[couchapp tool](http://couchapp.org/page/couchapp-python).

    apt-get install couchapp

Now we can use couchapp to push the files into your database:

    couchapp push

Now you can point your browser at the [Coconut](http://localhost:5984/coconut/_design/coconut/index.html)

You may wish to customise the .couchapprc file to point to different targets.

How does this work?
-------------------

CouchDB, [Backbone.js](http://documentcloud.github.com/backbone), [backbone-couchdb](https://github.com/janmonschke/backbone-couchdb), json, fermented eyebrow sweat, fairy dust.


How is this organized?
----------------------

All of the backbone [models](http://documentcloud.github.com/backbone/#Model) and [views](http://documentcloud.github.com/backbone/#Model) have their own file and are in app/models and app/views respectively. app/app.js is responsible for tying it all together.

You can put json forms into the \_docs directory and they will be added to your couch when you do a couchapp push.

How do I render a form?
----------------------

FormView loads the form.template.html, which provides the formElements div, where each form element is appended. FormView's render
function loops through each of the formElements using the addOne function. AddOne sets up the table and inserts new rows when a formelement's closeRow == "true".
It also renders a few other special widgets, such as headers and hidden fields. 
Most form elements are inserted using the following code:
<pre><code>
currentParent.append((new FormElementView({model: formElement})).render().el);
</code>
</pre>
Note how the currentParentName is saved in FormView's currentParentName field - this shows where the element should be appended.

FormElementView renders each element inside a td using the form-element-template, which calls the {{{renderWidget}}} tag.
Handlebars.registerHelper("renderWidget"... in formElementRender.js uses the relevant template based on the inputType for the element. 
Each widget is pre-compiled before the loop:
<pre>
<code>
inputTextWidgetCompiledHtml = Handlebars.compile($("#inputTextWidget").html());
datepickerWidgetCompiledHtml = Handlebars.compile($("#datepickerWidget").html());
checkboxWidgetCompiledHtml = Handlebars.compile($("#checkboxWidget").html());
</code>
</pre>
Look at the index2.html example. Each widget has its own handlebars.js template (see inputTextWidget).  
<pre>
<code>
<script id="dropdownWidget" type="text/x-handlebars-template">
	<select id='{{identifier}}' {{#options}}data-{{name}}='{{value}}' {{/options}} name='{{identifier}}'>
	{{#dropdown enumerations}}
	{{/dropdown}}
	</select>
</script>
</code>
</pre>

Performance test is at http://jsperf.com/test-pre-compiling-handlebars-js-templates

In the current example, the forms are PatientRegistration and ArrestDocket.js.

How do I customise page flow?
-----------------

app.js constructs the Backbone.Router. List the routes in the routes method:
    
    routes: {
        	"home":                 "home",    // #home
        	"newPatient":                 "newPatient",    // #newPatient
        	"arrestDocket":                 "arrestDocket",    // #arrestDocket
            "*actions": "defaultRoute" // matches http://example.com/#anything-here
        }
     
and create a method for each route:
    
        newPatient: function () {
        	registration = new Form({_id: "PatientRegistration"});
        	registration.fetch({
        		success: function(model){
        			(new FormView({model: model})).render(); 
        		}
        	});
        },

How incident id's are generated
-----------------

Incident id's are generated using update_seq by doing a GET on the db and (TBD) appending it to the site ID; however, I am slightly concerned about concurrentcy issues. 
But this would not happen on a couch instance on a mobile phone.

    var info = $.couch.db(Backbone.couch_connector.config.db_name).info(
	    {
		success : function(resp){
		console.log("info: " + JSON.stringify(resp));
		var doc_count = resp["doc_count"];
		var doc_del_count = resp["doc_del_count"];
		var assignedId = doc_count + doc_del_count;
		console.log("assignedId: " + assignedId);
		formData.assignedId = assignedId;
		// now save it... See FormView.js
		}

http://wiki.apache.org/couchdb/HTTP_database_API

Generating sequences in CouchDB goes against the grain of couch; note that this approach is only good per instance. Useful discussion here:

http://grokbase.com/t/couchdb.apache.org/dev/2011/02/jira-created-couchdb-1071-interger-uuids-1-2-3/22zyjuez6lqiqdcta7xwuixjmujm#20110222xcgwq4fpsddqjgyf3bqsksmafm

Also considered getting a substring of the sequential uuid - truncate the first 24 characters. More info on sequential uuids: 

https://issues.apache.org/jira/browse/COUCHDB-465?page=com.atlassian.jira.plugin.system.issuetabpanels:all-tabpanel
           
Other useful info
-----------------

It's a pain to run 'couchapp push' everytime you make a change. Mike wrote a little [watchr](http://rubygems.org/gems/watchr) script that watches for changes to any relevant files and then automatically pushes them into your couch. To get it you need to install rubygems and watchr:

    apt-get install rubygems
    gem install watchr

Help!
----
Check out the project's [issues](https://github.com/vetula/cconut/issues). Please help me fix issues and add any problem that you come across.
