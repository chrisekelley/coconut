SiteNavView = Backbone.Marionette.ItemView.extend
  template: JST["_attachments/templates/SiteNavView.handlebars"]

  events:
    "click .nav a":"toggle"

  toggle: =>
    $(".navbar-toggle").click()


