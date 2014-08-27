class User extends Backbone.Model
  url: "/user"

  username: ->
    @get("_id").replace(/^user\./,"")

  passwordIsValid: (password) ->
    @get("password") is password

  isAdmin: ->
    @username() is "admin"

  login: ->
    $.cookie('current_user', @username())
    $("#user").html @username()
    $('#district').html @get "district"
    $("a[href=#logout]").show()
    $("a[href=#login]").hide()
    if @isAdmin() then $("#manage-button").show() else $("#manage-button").hide()
    User.currentUser = @

  refreshLogin: ->
    @login()

User.isAuthenticated = (options) ->
#  if $.cookie('current_user')?
    user = new User
#      _id: "user.#{$.cookie('current_user')}"
      _id: "user.admin"
    user.fetch
      success: ->
        user.refreshLogin()
        options.success(user)
      error: ->
        # current user is invalid (should not get here)
        options.error()
#  else
#    # Not logged in
#    options.error()

User.logout = ->
  $.cookie('current_user',"")
  $("#user").html ""
  $('#district').html ""
  $("a[href=#logout]").hide()
  $("a[href=#login]").show()
  User.currentUser = null

class UserCollection extends Backbone.Collection
  model: User
  url: '/user'

