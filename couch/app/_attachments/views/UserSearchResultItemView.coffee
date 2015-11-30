UserSearchResultItemView = Backbone.Marionette.ItemView.extend
  tagName: 'tr'
  template: JST["_attachments/templates/UserSearchResultItemView.handlebars"]
  attributes: ()->
      "data-id": @model.get("_id")
  events:
    "click td":  "searchByIDclicked"

#  render: =>
#    id = user.get("_id")
#    DOB = user.get("DOB")
#    Gender = user.get("Gender")
#    createdAt = user.get("createdAt")
#    currentDistrict = user.get("currentDistrict")
#    @$el.html "<tr>" +
#        "<td class='loadPatientView' data-id='" + id + "'>" + DOB + "</td>" +
#        "<td>" + Gender + "</td>" +
#        "<td>" + createdAt + "</td>" +
#        "<td>" + currentDistrict + "</td>" +
#        "</tr>"

  searchByIDclicked: (e) ->
    id = $(e.currentTarget).parent().data("id")
#    console.log("id:" + id)
    client = Coconut.searchUsers.get(id)
    sendClientToRecords(client)
#      console.log("for id: " + id + " client: " + JSON.stringify(client))

  sendClientToRecords = (users, threshold) ->
    if users.length > 1
#      console.log("users.length > 1; threshold: " + threshold)
      Coconut.searchUsers = users
      tableView = new UserSearchResultCompositeView({collection: users})
      Coconut.idResults.show tableView
    else
      if Object.prototype.toString.call( users ) == '[object Array]'
        client = users[0]
      else
        client = users
      if client == null
        alert("Client not found.")
        Coconut.router.navigate "displayUserScanner", true
      else
        client.threshold = threshold
  #      console.log 'Coconut.currentClient: ' + JSON.stringify client + " threshold: " + threshold
        Coconut.currentClient = client
        CoconutUtils.setSession('currentClient', true)
        Coconut.router.navigate "displayClientRecords", true

