--- 
title: Design
layout: post
category: none
date: 2011-10-09
---
## Home Page

To customise the Home page, edit home.vert.template.html. 

## Buttons

Change the width of the buttons by editing the style of the button:

    <button id='form-client'class="menu-blue" style="width: 100px;">New Incident</button>
    
There is also a menu-skinny-blue for a 20px button.

The events triggered by clicking a button are linked by the button id. The Home page's button events are in HomeView.js:

    events: {
		"click #form-search " : "search",
		"click #form-incident" : "incidentLink",
		"click #form-config " : "configLink",
		"click #form-design " : "designLink",
		"orientationEvent " : "orientation",
    	},    

Here is the target for the click #form-incident event:

    incidentLink: function() {
		  FORMY.router.navigate('incident', true);
	  },
	  
This target forwards the user to the incident route in app.js.	  