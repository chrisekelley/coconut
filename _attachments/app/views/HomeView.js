var HomeView = Backbone.View.extend({
	//el: $("#homePageView"),
	template: loadTemplate("home.template.html"),
	initialize: function() {
		_.bindAll(this, 'addOne', 'reseted', 'render', 'search', 'orientation', 'nextLink');
		FORMY.Incidents.bind('add',   this.addOne, this);
		//FORMY.Incidents.bind('search',   this.search, this);
		FORMY.Incidents.bind('reset', this.reseted, this);
		FORMY.Incidents.bind('all',   this.render, this);
		FORMY.Incidents.bind('change', this.search, this);
		FORMY.Incidents.bind('render', this.render, this);
		return this;
	},
	startkey: null,
	startkey_docid: null,
	endkey_docid: null,
	addOne : function(patient){
		this.view = new SearchListItemView({model: patient});
		this.rendered = this.view.render().el;
		//console.log("add one in HomeView:" + JSON.stringify(patient));
		$("#incidents").append(this.rendered);
	},
	events: {
		"click #form-search " : "search",
		"click #form-client " : "incidentLink",
		"click #form-config " : "configLink",
		"click #form-design " : "designLink",
		"click #nextLink"	  : "nextLink",
		"orientationEvent " : "orientation",
	},
	reseted: function() {
		console.log("reseted; Incidents count: " + FORMY.Incidents.length);
		$(this.el).html("");
		FORMY.Incidents.each(this.addOne);
	},
	remove: function() {
		console.log("remove the view in homeView");
		$(this.el).remove();
	},
	nextLink: function() {
		console.log("this.model.toJSON(): " + this.model.get("startkey"));
		if (this.model.get("startkey") != null) {
			FORMY.router.navigate('home/' + this.model.get("startkey") + '/' + this.model.get("startkey_docid"), true);
			//FORMY.router.navigate('home/' + this.model.get("startkey"), true);
		} else {
			console.log("nextLink");
		}
	},
	incidentLink: function() {
		FORMY.router.navigate('incident', true);
	},
	configLink: function() {
		//window.location.href = '/mobilefuton/_design/mobilefuton/index.html';
		FORMY.router.navigate('config', true);
	},
	designLink: function() {
		FORMY.router.navigate('design', true);
	},
	search: function(e) {
		e.preventDefault();
		console.log("Searching");
		var searchTerm =  $('#search_string').val();
		var department =  $('#department').val();
		//FORMY.router.navigate('search/' + searchTerm, true);
		if (searchTerm == "" && department == "") {
			FORMY.router.navigate('home', true);
		} else {
			FORMY.router.navigate('search/' + searchTerm + "/" + department, true);
		}
	},
	orientation: "horiz",
	//reportEducationInstance:null,
	render: function() {
//		$("#formRenderingView").remove();
//		$("#recordView").remove();
		//console.log("render in HomeView:" + JSON.stringify(this.model));
		//this.content = this.model.toJSON();
		
//		window.addEventListener(orientationEvent, function() {
//			alert('HOLY ROTATING SCREENS BATMAN:' + window.orientation + " " + screen.width);
//			}, false);
		// -90 480
	   
		if (window.orientation == -90) {
			//alert('HOLY ROTATING SCREENS BATMAN - render vertical:' + window.orientation + " screen.width: " + screen.width);
			this.orientation = "vert";
			this.template =  loadTemplate("home.vert.template.html");
		} else {
			//alert('HOLY ROTATING SCREENS BATMAN - otherwise:' + window.orientation + " screen.width: " + screen.width);
			this.orientation = "horiz";
			this.template =  loadTemplate("home.vert.template.html");
			//this.template =  loadTemplate("home.template.html");
		}
		var homeViewHtml = this.template(this.model.toJSON());
		console.log("rendering HomeView");
		//$(this.el).html(homeViewHtml);
		$("#homePageView").html(homeViewHtml);
		//if(FORMY.Incidents.length > 0){
		FORMY.Incidents.each(this.addOne);
		
		$(".stripeMe tr").mouseover(function(){$(this).addClass("over");}).mouseout(function(){$(this).removeClass("over");});
		$(".stripeMe tr:even").addClass("alt");
		return this;
	},
});

var SearchListItemView = Backbone.View.extend({
	tagName : "tr",
	template: Handlebars.compile($("#search-template").html()),
	initialize : function(){
		//this.model.bind('change', this.render, this);
		// from backbone-couch.js chat example:
		 _.bindAll(this, 'render');
		this.model.bind('change', this.render);
	},

	render : function(){ 
		this.content = this.model.toJSON();
		this.html = this.template(this.content);
		$(this.el).html(this.html);
		//console.log("render SearchListItemView: "+ JSON.stringify(html));
		return this;
	}
});
