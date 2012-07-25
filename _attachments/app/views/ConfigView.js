var ConfigView = Backbone.View.extend({
	//el: $("#homePageView"),
	template: loadTemplate("config.template.html"),

	initialize: function() {
		return this;
	}, 
	events: {
		"click #form-client " : "incidentLink",
		"click #form-config " : "configLink",
		"click #form-design " : "designLink",
		//"orientationEvent " : "orientation",
	},
	reseted: function() {
		console.log("reseted.");
	},
	remove: function() {
		console.log("remove the view in homeView");
		$(this.el).remove();
	},
	incidentLink: function() {
		FORMY.router.navigate('incident', true);
	},
	configLink: function() {
		window.location.href = '/mobilefuton/_design/mobilefuton/index.html';
	},
	designLink: function() {
		FORMY.router.navigate('design', true);
	},
	orientation: "horiz",
	render: function() {

		var viewHtml = this.template(this.model.toJSON());
		console.log("rendering ConfigView");
		$("#homePageView").html(viewHtml);
		return this;
	},
});