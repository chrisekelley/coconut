class LoginView extends Backbone.View

  el: '#content'

  render: =>
    @$el.html "
      <style>
        #login_wrapper{
          font-size: 200%;
          width:50%;
          margin: 0px auto;
        }
        #login_message{
          margin-top: 20px;
          margin-bottom: 20px;

        }
        #login_form input{
          font-size: 100%;
          display: block;
        }
        #login_form input[type=submit]{
          height: 2em;
        }
      </style>
      <div id='login_wrapper'>
        <div id='login_message'>Please login to continue:</div>
        <form id='login_form'>
          <label for='username'>Username</label>
          <input type='text' id='username' name='username'>
          <label for='password'>Password</label>
          <input id='password' name='password' type='password'>
          <input type='submit' value='Login'>
        </form>
      </div>
    "
#    $("input[type=text],input[type=password]").textinput()
#    $("input[type=submit]").button()

  events:
    "submit form#login_form": "login"

  updateNavBar: ->

  # Note this needs hashing and salt for real security
  login: ->
    loginData = $('#login_form').toObject()
    user = new User
      _id: "user.#{loginData.username}"

    user.fetch
      success: =>
        # User exists
        if user.passwordIsValid loginData.password
          user.login()

          @callback.success()
        else
          $('#login_message').html "Wrong password"
      error: =>
        $('#login_message').html "Wrong username"
    return false
