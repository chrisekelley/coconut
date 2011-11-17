--- 
title: Coconut
layout: default
category: none
---

Coconut renders JSON defined forms in a browser and then saves the results to couchdb.

##What is it for?

You can use Coconut to create data entry applications that can be used on smart phones and computers. 
Data is stored on the device. When a network connection is available,  the data is automatically synchronized with the server.  
A dashboard is available so that the user can track progress.

##How does it work?

<a href="images/coconut_dashboard.png" style="text-decoration:underline"><img src="images/coconut_dashboard_small.png" align="right"/></a>

Coconut uses CouchDB for data storage and synchronization, [Backbone.js](http://documentcloud.github.com/backbone) for MVC, 
[backbone-couchdb](https://github.com/janmonschke/backbone-couchdb) to connect backbone to CouchDB, and 
[D3](http://mbostock.github.com/d3/) for charts.

Coconut can be run on a computer or installed on a mobile phone or tablet. 
[Android-Coconut-MobileFuton](https://github.com/vetula/Android-Coconut-MobileFuton) is an example that may be used on an Android 10.1" tablet. 
[Android-Tims-MobileFuton](https://github.com/vetula/Android-Tims-MobileFuton) is formatted for Android smart phones.

##How do I get started?

When the application starts, it displays a list of records with button to forms on the left and charts on the right. 
The application user interface is described in greater detail in [Using Coconut](using.html). 

##May I see it?

Yes, here are some [screencasts](screencasts.html).

##Technical details

Coconut features a built-in form designer - 
big shout out to the Dimagi folks who created [FormDesignerAlpha](https://github.com/dimagi/FormDesignerAlpha). 
Coconut uses a [version customized for JSON form export](https://github.com/vetula/FormDesignerAlpha). 
The form is saved to the CouchDB and may then be used by your application. 
View the [Form Designer](form_designer.html) page for more information on creating forms.

Coconut uses [Backbone.js](http://documentcloud.github.com/backbone) for its MVC (Model View Controller) framework. 
All of the backbone [models](http://documentcloud.github.com/backbone/#Model) and [views](http://documentcloud.github.com/backbone/#Model) have their own file and are in app/models and app/views respectively. 
app/app.js is responsible for tying it all together.

You can put json forms into the \_docs directory and they will be added to your couch when you do a couchapp push.

See the page about [Application Design](app_design.html) for more information on Coconut form rendering and application flow.

Charts and the use of Jquery promise are described on the [charts page](charts.html).

##Gimme a features list!

* [Form Designer](form_designer.html)
* [Charts](charts.html)
* Storage and Replication using CouchDB
* Support for mobile phones and tablets

##Download

You can download this project in either
<a href="http://github.com/vetula/coconut/zipball/master">zip</a> or
<a href="http://github.com/vetula/coconut/tarball/master">tar</a> formats.

You can also clone the project with <a href="http://git-scm.com">Git</a> by running:
  <pre>$ git clone git://github.com/vetula/coconut</pre>

get the source code on GitHub : <a href="http://github.com/vetula/coconut">vetula/coconut</a>

##Credit

Authors: Chris E. Kelley (ckelley@rti.org), 
Mike McKay (mmckay@rti.org)  

Contact: Chris E. Kelley (ckelley@rti.org)

  <script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-22835379-4");
pageTracker._trackPageview();
} catch(err) {}</script>
