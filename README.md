# Coconut renders json defined forms in a browser and then saves the results to couchdb.

## Instructions

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

## How does this work?

CouchDB, [Backbone.js](http://documentcloud.github.com/backbone), [backbone-couchdb](https://github.com/janmonschke/backbone-couchdb), json, fermented eyebrow sweat, fairy dust.

## How is this organized?

All of the backbone [models](http://documentcloud.github.com/backbone/#Model) and [views](http://documentcloud.github.com/backbone/#Model)
have their own file and are in app/models and app/views respectively. app/app.js is responsible for tying it all together.

You can put json forms into the \_docs directory and they will be added to your couch when you do a couchapp push.
Please note that this capability is no longer supported.

## Setup

The pouch.watchr script compiles your coffeescripts automatically. The npm start task (see package.json) runs this task for you.
See the Pouch watchr section below for details and dependencies.

This app is designed to sync with a central server for configuration data. Create another couch called coconut-central.
Upload samplejson/coconut.config to it.

You can also create another couch to sync data to it. See the name for synchronization_target in samplejson/coconut.config.

The first time the app runs, enter the url to coconut-central.

To login to the app, seed the coconut couch with samplejson/user.admin and user.john. If you're coconut-central is setup properly,
it may have already sync'd these users over. If not, well here you go.

## Starting the app

The npm start task (see package.json) runs a small http server, launches a grunt handlebars watch script, and also a coffeescript watchr script.

## How do I add new libraries?

Use [bower](bower.io). The following libs are already installed. The "-S" switch saves the lib to your bower.json.

    bower install -S pouchdb
    bower install -S https://raw.githubusercontent.com/jo/backbone-pouch/master/backbone-pouch.js

## Form building tips

There is an [explanation of forms here](https://github.com/chrisekelley/coconut/blob/coconut-pouch/docs/forms.md).

Change the routing after a form is submitted in QuestionView:

      @result.save currentData,
        success: (model) =>
          $("#messageText").slideDown().fadeOut()
          Coconut.router.navigate("edit/result/#{model.id}",false)

          # Update the menu
          Coconut.menuView.update()

          if @result.complete()
            if @result.question == 'Admin Registration'
              Coconut.router.navigate("postUserRegistrationMenu",true)
            else
              Coconut.router.navigate("",true)

## Adding new form element types

If you need to add a new element to the form builder, modify :
- DesignView.coffee questionTypes
- QuestionView.coffee

## Compiling Templates

The following grunt task will monitor _attachments/templates and pre-compile your handlebars templates:

    grunt watch

The npm start task (see package.json) runs this task for you.

## Reports

See [the report doc](docs/reports.md).

## What are the important record identifiers

 - clientId = Coconut.currentClient.get("_id")

## How do I handle application updates?

The app uses [org.apache.cordova.plugin.version](https://github.com/chrisekelley/Version) to manage updates.

Increment android:versionCode="1" in config.xml. NOTE: Don't bother trying to update AndroidManifest.xml - it will get wiped out by the cordova build process.

Edit version on the CouchDB server

    {"_id":"version","_rev":"3-e79c2920983393d26fd0c1d919358cf4","version":"3","url":"http://internet.org/kiwi.apk"}

Within the Cordova container, you can set parameters to wipe the app cache, which will completely reset the app. See its
[README](https://github.com/chrisekelley/kiwi-cordova/blob/master/README.md#updates) for more info.

## Internationalization (i18n)

Kiwi uses the [node-polyglot](https://www.npmjs.org/package/node-polyglot) lib to handle multiple languages. Place your
language files in the 18n directory according to [locale](https://developer.chrome.com/webstore/i18n#localeTable). Portuguese
is currently hardcoded; however, you can unset that in i18n/language_chooser.coffee.

Use the following syntax in your coffee file:

    polyglot = new Polyglot()
    polyglot.extend({
        "Home": "Home"
        "Sync": "Sync"
        "SutureTypeL": "Suture Type"
        "SutureTypeL::Silk": "Silk"
        "SutureTypeL::Absorbable": "Absorbable"
    })

Text for dropdowns uses two semi-colons between the field identifier and the dropdown key.

You may wish to register a handlebars helper (for use in templates) at the end of your file:

    Handlebars.registerHelper   'polyglot', (phrase)->
        polyglot.t(phrase)

In your handlebars template, use the following syntax:

    {{{polyglot "Home" }}}

If you need to use polyglot in your js/coffee files:

    polyglot.t("replicationLogDescription")

## Re-init the development database

In order to reset the app when developing locally, you must delete the local indexeddb instance:

  indexedDB.deleteDatabase('_pouch_coconut');

You also should delete the other pouch db's related to the app, which are used to speed up the views. These db's have a
unique name, so find the name in devtools/Resources/Indexeddb and modify the name.

  indexedDB.deleteDatabase('_pouch_coconut-mrview-1f25d520a467c823dd18beca3000809e');
  indexedDB.deleteDatabase('_pouch_coconut-mrview-4cd1cd399de52c6325a3c89750262205');
  indexedDB.deleteDatabase('_pouch_coconut-mrview-d64ce65c938ae0c44375c9ec586645e3');
  indexedDB.deleteDatabase('_pouch_coconut-mrview-83ceb52de53e12103f3cedbc413ad3b7');

Cleanup any orphined indexes

  pouch.viewCleanup()

## App flow

### Identification:

If a client is not identified, the id service provides a service-specific uuid (serviceUuid). The app also generates a uuid,
which is used to identify the client.

## How do I add the Dashboard to a page?

The Dashboard displays the gender and birthdate of the current client. It is rendered using a
[Marionette LayoutView](https://github.com/marionettejs/backbone.marionette/blob/master/docs/marionette.layoutview.md).

Place your view in dashboardLayout.contentRegion.

    dashboardLayout = new DashboardLayout();
    Coconut.mainRegion.show dashboardLayout
    dashboardView = new ClientDashboardView {model: Coconut.currentClient}
    dashboardLayout.dashboardRegion.show dashboardView
    staticView = new StaticView(template: JST["_attachments/templates/PostUserRegistrationMenuView.handlebars"])
    dashboardLayout.contentRegion.show(staticView)

## How do I customise page flow?

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


## Watchr script

The npm start script launches the pouch.watchr script. Here is some info about it and its dependencies:

It's a pain to run 'couchapp push' everytime you make a change. Mike wrote a little [watchr](http://rubygems.org/gems/watchr)
script that watches for changes to any relevant files and then automatically pushes them into your couch.
To get it you need to install rubygems and watchr:

    apt-get install rubygems
    gem install watchr
    watchr pouch.watchr

## Help!

Check out the project's [issues](https://github.com/mikeymckay/coconut/issues). Please help me fix issues and add any problem that you come across.
