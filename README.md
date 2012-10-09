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

Create a .couchapprc file based on .couchapprc.sample. Then we can use couchapp to push the files into your database:

    couchapp push

Now you can point your browser at the [Coconut](http://localhost:5984/coconut/_design/coconut/index.html)

How does this work?
-------------------

CouchDB, [Backbone.js](http://documentcloud.github.com/backbone), [backbone-couchdb](https://github.com/janmonschke/backbone-couchdb), json, fermented eyebrow sweat, fairy dust.


How is this organized?
----------------------

All of the backbone [models](http://documentcloud.github.com/backbone/#Model) and [views](http://documentcloud.github.com/backbone/#Model) have their own file and are in app/models and app/views respectively. app/app.js is responsible for tying it all together.

You can put json forms into the \_docs directory and they will be added to your couch when you do a couchapp push.

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

           
Other useful info
-----------------

It's a pain to run 'couchapp push' everytime you make a change. Mike wrote a little [watchr](http://rubygems.org/gems/watchr) script that watches for changes to any relevant files and then automatically pushes them into your couch. To get it you need to install rubygems and watchr:

    apt-get install rubygems
    gem install watchr

Help!
----
Check out the project's [issues](https://github.com/mikeymckay/coconut/issues). Please help me fix issues and add any problem that you come across.
