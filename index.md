--- 
title: Coconut
layout: default
category: none
---

Coconut renders json defined forms in a browser and then saves the results to couchdb.

##What is it for?

You can use Coconut to create data entry applications that can be used on smart phones and computers. 
Data is stored on the device. When a network connection is available,  the data is automatically synchronized with the server.  
A dashboard is available so that the user can track progress.

##How does it work?

Coconut uses CouchDB for data storage and synchronization, [Backbone.js](http://documentcloud.github.com/backbone) for MVC, 
[backbone-couchdb](https://github.com/janmonschke/backbone-couchdb) to connect backbone to CouchDB, and [D3](http://mbostock.github.com/d3/) for charts.

## How do I get started?

Coconut features a built-in form designer - shout out to the Dimagi folks who created [FormDesignerAlpha](https://github.com/dimagi/FormDesignerAlpha). 
The form is saved to the CouchDB and may then be used by your application.

Coconut uses [Backbone.js](http://documentcloud.github.com/backbone) for its MVC (Model View Controller) framework. 
All of the backbone [models](http://documentcloud.github.com/backbone/#Model) and [views](http://documentcloud.github.com/backbone/#Model) have their own file and are in app/models and app/views respectively. 
app/app.js is responsible for tying it all together.

You can put json forms into the \_docs directory and they will be added to your couch when you do a couchapp push.

See the page about [Application Design](app_design.html) for more information on Coconut form rendering and application flow.

##Download

You can download this project in either
<a href="http://github.com/vetula/coconut/zipball/master">zip</a> or
<a href="http://github.com/vetula/coconut/tarball/master">tar</a> formats.

You can also clone the project with <a href="http://git-scm.com">Git</a> by running:
  <pre>$ git clone git://github.com/vetula/coconut</pre>

get the source code on GitHub : <a href="http://github.com/vetula/coconut">vetula/coconut</a>

##Credit

Authors: Chris E. Kelley (chris@vetula.com)
Mike McKay (mike@vdomck.org)  

Contact: Chris E. Kelley (chris@vetula.com)

  <script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-22835379-4");
pageTracker._trackPageview();
} catch(err) {}</script>
