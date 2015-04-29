var LocalConfigView,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

LocalConfigView = (function(superClass) {
  extend(LocalConfigView, superClass);

  function LocalConfigView() {
    return LocalConfigView.__super__.constructor.apply(this, arguments);
  }

  LocalConfigView.prototype.el = '#content';

  LocalConfigView.prototype.render = function() {
    var ref;
    this.$el.html("<form id='local-config'> <h1>Configure your Coconut system</h1> <label for='coconut-cloud' >Coconut Cloud URL</label> <select name='coconut-cloud'> <option value='https://kiwicentral.org/coconut-central'>kiwicentral.org/coconut-central</option> <option value='https://kiwicentral.org/coconut-central-test'>kiwicentral.org/coconut-central-test</option> <option value='http://localhost:5984/coconut-central-local'>localhost:5984/coconut-central-local</option> </select> <label for='coconut-cloud-custom' >Coconut Cloud URL: custom (Override the dropdown options.)</label> <input type='text' name='coconut-cloud-custom' size='35' value=''></input> <br/> <br/> <label for='username' class='localConfigCols'>Username</label> <input type='text' name='username' size='15'></input><br/> <label for='password' class='localConfigCols'>Password</label> <input type='password' name='password' size='15'></input> <fieldset id='mode-fieldset'> <legend>Mode</legend> <label for='cloud'>Cloud (reporting system)</label> <input id='cloud' name='mode' type='radio' value='cloud'></input> <label for='mobile'>Mobile (data collection, probably on a tablet)</label> <input id='mobile' name='mode' type='radio' value='mobile'></input> </fieldset> <br/> <br/> <button>Save</button> <div id='message'></div> </form>");
    if (Coconut.config.get("mode") == null) {
      $("#mode-fieldset").hide();
      $("#mobile").prop("checked", true);
    }
    return (ref = Coconut.config.local) != null ? ref.fetch({
      success: function() {
        return js2form($('#local-config').get(0), Coconut.config.local.toJSON());
      },
      error: function() {
        return $('#message').html("Complete the fields before continuing");
      }
    }) : void 0;
  };

  LocalConfigView.prototype.events = {
    "click #local-config button": "save"
  };

  LocalConfigView.prototype.save = function() {
    var coconutCloud, coconutCloudConfigURL, coconutCloudConfigURLCreds, coconutCloudCustom, localConfig, options, password, replacement, request, username;
    localConfig = $('#local-config').toObject();
    coconutCloudCustom = $("input[name=coconut-cloud-custom]").val();
    if (coconutCloudCustom !== '') {
      coconutCloud = coconutCloudCustom;
    } else {
      coconutCloud = $("select[name=coconut-cloud]").val();
    }
    username = localConfig.username;
    password = localConfig.password;
    coconutCloudConfigURL = coconutCloud + "/coconut.config";
    replacement = 'https://' + username + ':' + password + '@';
    coconutCloudConfigURLCreds = coconutCloudConfigURL.replace(/https:\/\//, replacement);
    if (localConfig.mode && (coconutCloud != null)) {
      options = {
        url: coconutCloudConfigURLCreds,
        dataType: "jsonp",
        username: username,
        password: password,
        error: function(xOptions, textStatus) {
          return $('#message').append("There was an error - the username/password were probably incorrect. Error message: " + textStatus + "<br/>");
        },
        statusCode: {
          404: function() {
            return alert("404 error: page not found");
          },
          401: function() {
            return alert("incorrect username/password");
          }
        },
        success: function(cloudConfig, jqxhr, textStatus) {
          $('#message').append("Configuration downloaded. Saving configuration file.<br/>");
          delete cloudConfig["_rev"];
          return Coconut.config.save(cloudConfig, {
            success: function() {
              var cloud_credentials, opts;
              $('#message').html("Downloading configuration file from " + coconutCloudConfigURL + "<br/>");
              $('#message').append("Creating local configuration file<br/>");
              cloud_credentials = cloudConfig.cloud_credentials;
              Coconut.syncView = new SettingsView();
              $('#message').append("Replicating form definitions and syncing with the server.<br/>");
              opts = {
                success: function() {
                  var repFromOpts;
                  $('#message').append("Replication of form definitions was successful..<br/>");
                  repFromOpts = {
                    success: function() {
                      var repToOpts;
                      repToOpts = {
                        success: function() {
                          $('#message').append("Replication to server was successful. <br/>");
                          $('#message').append("Finished with Config. Reloading app in 2 seconds.<br/>");
                          return _.delay(function() {
                            Coconut.router.navigate("", false);
                            return document.location.reload();
                          }, 2000);
                        },
                        error: function(obj, msg) {
                          return $('#message').append("Replication Error:" + msg + "<br/>");
                        }
                      };
                      $('#message').append("Replication from server was successful.<br/>");
                      return Coconut.syncView.sync.replicateToServer(repToOpts);
                    },
                    error: function(obj, msg) {
                      return $('#message').append("Replication Error:" + msg + "<br/>");
                    }
                  };
                  return Coconut.syncView.sync.replicateFromServer(repFromOpts);
                },
                error: function(obj, msg) {
                  return $('#message').append("Error fetching Forms. App will not function properly. Error:" + msg + "<br/>");
                }
              };
              Coconut.config.local = new LocalConfig();
              return Coconut.config.local.save({
                _id: "coconut.config.local",
                coconutCloud: coconutCloud,
                cloud_credentials: cloud_credentials
              }, Coconut.syncView.sync.replicateForms(opts));
            },
            error: function(model, err, cb) {
              return console.log(JSON.stringify(err));
            }
          });
        },
        fail: function(jqXHR, textStatus, errorThrown) {
          var message;
          message = ("Couldn't find config file at " + coconutCloudConfigURL + ". Message: ") + textStatus + " Error Thrown: " + JSON.stringify(errorThrown);
          console.log(message);
          $('#message').append(message);
          return alert("Error:" + message);
        }
      };
      $('#message').append('Downloading configuration.');
      request = $.ajax(options);
      return false;
    } else {
      $('#message').html("Fields incomplete");
      return false;
    }
  };

  return LocalConfigView;

})(Backbone.View);
