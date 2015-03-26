var VerifyView;

VerifyView = Backbone.Marionette.ItemView.extend({
  template: JST["_attachments/templates/VerifyView.handlebars"](),
  className: "itemView",
  events: {
    "click #identifyIndividual": "identifyIndividual",
    "click #identifyAdmin": "identifyAdmin",
    "click #scan": "scanNewIndividual",
    "click #verifyYes": "displayNewUserRegistration",
    "click #verifyNo": "displayNewUserRegistration",
    "click #refresh": "refresh",
    "click #verifySendLogs": "sendLogs",
    "click #continueAfterFail": "continueAfterFail"
  },
  nextUrl: null,
  hasCordova: true,
  currentOfflineUser: null,
  initialize: function() {
    this.sync = new Sync();
    if (typeof cordova === "undefined") {
      return this.hasCordova = false;
    }
  },
  displayNewUserRegistration: function() {
    Coconut.router.navigate("userRegistration", true);
  },
  diplayNewReportMenu: function() {},
  scanNewIndividual: function(e) {
    this.scan(e, "Enroll");
  },
  register: function(e) {
    this.scan(e, "Enroll");
  },
  identifyIndividual: function(e) {
    this.scan(e, "Identify", "Individual");
  },
  identifyAdmin: function(e) {
    this.scan(e, "Identify", "Admin");
  },
  scan: function(event, method, user) {
    var display, revealSlider;
    this.eventUrl = this.nextUrl;
    display = function(message) {
      var label, lineBreak;
      console.log("display message: " + message);
      display = document.getElementById("message");
      lineBreak = document.createElement("br");
      label = document.createTextNode(message);
      display.appendChild(lineBreak);
      display.appendChild(label);
    };
    revealSlider = (function(_this) {
      return function(event, method, user) {
        var button, maxRepeat, progress, repeat, startLadda;
        startLadda = function(e) {
          var findUserFromServiceUUID, i, interval, l;
          l = Ladda.create(e.currentTarget);
          l.start();
          findUserFromServiceUUID = function(serviceUuid, prints) {
            var users, viewOptions;
            viewOptions = {};
            users = new SecondaryIndexCollection;
            return users.fetch({
              fetch: 'query',
              options: {
                query: {
                  key: serviceUuid,
                  include_docs: true,
                  fun: 'by_serviceUuid'
                }
              },
              success: (function(_this) {
                return function() {
                  var adminUser, client, message, uuid;
                  console.log('by_serviceUuid returned: ' + JSON.stringify(users));
                  l.stop();
                  if (users.length > 0) {
                    if (user === "Admin") {
                      adminUser = users.first();
                      console.log('Coconut.currentAdmin: ' + JSON.stringify(adminUser));
                      Coconut.currentAdmin = adminUser;
                      CoconutUtils.setSession('currentAdmin', adminUser.get('email'));
                      return Coconut.router.navigate("displayUserScanner", true);
                    } else {
                      client = users.first();
                      console.log('Coconut.currentClient: ' + JSON.stringify(client));
                      Coconut.currentClient = client;
                      CoconutUtils.setSession('currentClient', true);
                      return Coconut.router.navigate("displayClientRecords", true);
                    }
                  } else {
                    message = 'Strange. This user was identified but is not registered. User: ' + user;
                    console.log(message);
                    $('#progress').append("<br/>" + message);
                    uuid = CoconutUtils.uuidGenerator(30);
                    Coconut.currentClient = new Result({
                      _id: uuid,
                      serviceUuid: serviceUuid,
                      Fingerprints: prints
                    });
                    console.log("currentClient: " + JSON.stringify(Coconut.currentClient));
                    if (user === "Admin") {
                      Coconut.currentAdmin = new Result({
                        _id: uuid,
                        serviceUuid: serviceUuid,
                        Fingerprints: prints
                      });
                      console.log("currentAdmin: " + JSON.stringify(Coconut.currentAdmin));
                      CoconutUtils.setSession('currentAdmin', null);
                      return Coconut.trigger("displayAdminRegistrationForm");
                    } else {
                      return Coconut.trigger("displayUserRegistrationForm");
                    }
                  }
                };
              })(this)
            });
          };
          if (_this.hasCordova) {
            console.log("method: " + method);
            if (method === "Identify") {
              cordova.plugins.SecugenPlugin.scan(function(results) {
                var finger, fingerprint, payload, prints, template, timeout, urlServer;
                finger = $('#Finger').val();
                payload = {};
                payload["Key"] = Coconut.config.get("AfisServerKey");
                payload["Name"] = Coconut.config.get("AfisProjectName");
                payload["Template"] = results;
                payload["Finger"] = finger;
                console.log("payload: " + JSON.stringify(payload));
                template = payload.Template;
                fingerprint = {};
                fingerprint.template = template;
                fingerprint.finger = finger;
                prints = [];
                prints.push(fingerprint);
                Coconut.currentPrints = prints;
                urlServer = Coconut.config.get("AfisServerUrl") + Coconut.config.get("AfisServerUrlFilepath") + "Identify";
                timeout = 15000;
                $('#progress').append("<br/>Fingerprint scanned. Now uploading to server. User: " + user);
                $('#progress').append("<br/>Server URL: " + urlServer);
                $('#progress').append("<br/>Timeout: " + timeout);
                $.ajaxSetup({
                  type: 'POST',
                  timeout: timeout,
                  error: function(xhr) {
                    var message;
                    l.stop();
                    _this.currentOfflineUser = user;
                    if (user === 'Admin') {
                      message = polyglot.t("errorUploadingScan") + ": " + xhr.statusText + " . " + polyglot.t("offlineScanContinueAdmin");
                    } else {
                      message = polyglot.t("errorUploadingScan") + ": " + xhr.statusText + " . " + polyglot.t("offlineScanContinueNewPatient");
                    }
                    $("#uploadFailedMessage").html(message);
                    $("#uploadFailed").css({
                      "display": "block"
                    });
                    console.log(message);
                    console.log("Fingerprint server URL: " + urlServer);
                    return $('#progress').append(message);
                  }
                });
                return $.post(urlServer, payload, function(result) {
                  var error, log, scannerPayload, serviceUuid, statusCode;
                  console.log("response from service: " + JSON.stringify(result));
                  $('#progress').append("<br/>Received response from service. StatusCode: " + statusCode);
                  try {
                    scannerPayload = payload["Template"];
                    statusCode = result.StatusCode;
                    serviceUuid = result.UID;
                    console.log('query for serviceUuid: ' + serviceUuid);
                  } catch (_error) {
                    error = _error;
                    console.log(error);
                    $('#progress').append("<br/>Error uploading scan: " + error);
                  }
                  if (statusCode !== null && statusCode === 1) {
                    $('#progress').append("<br/>Locating user in local database.");
                    return findUserFromServiceUUID(serviceUuid, prints);
                  } else if (statusCode !== null && statusCode === 4) {
                    $('#progress').append("<br/>User not in the local database.");
                    l.stop();
                    if (user === 'Admin') {
                      CoconutUtils.setSession('currentAdmin', null);
                    } else {
                      CoconutUtils.setSession('currentClient', true);
                    }
                    $('#progress').append("<br/>Enrolling new fingerprint. User: " + user);
                    urlServer = Coconut.config.get("AfisServerUrl") + Coconut.config.get("AfisServerUrlFilepath") + "Enroll";
                    return $.post(urlServer, payload, function(result) {
                      console.log("response from service: " + JSON.stringify(result));
                      statusCode = result.StatusCode;
                      serviceUuid = result.UID;
                      console.log("statusCode: " + statusCode);
                      if (statusCode !== null) {
                        if (statusCode === 1) {
                          $('#progress').append("<br/>Fingerprint enrolled. Success! User: " + user);
                          return _this.registerEnrolledPerson(serviceUuid, prints, user);
                        } else {
                          $("#progress").append('Problem enrolling fingerprint. StatusCode: ' + statusCode);
                          return Coconut.trigger("displayEnroll");
                        }
                      }
                    }, "json");
                  } else {
                    l.stop();
                    $("#message").append("Problem processing fingerprint. StatusCode: " + statusCode);
                    log = new Log();
                    return log.save({
                      message: "Problem processing fingerprint.",
                      statusCode: statusCode
                    }, {
                      success: function() {
                        $("#message").append("<br/>Saved log about problem.");
                        return console.log("Saved log about problem.");
                      },
                      error: function(model, err, cb) {
                        return console.log(JSON.stringify(err));
                      }
                    });
                  }
                }, "json");
              }, function(error) {
                var log, message;
                l.stop();
                console.log("SecugenPlugin.scan error: " + error);
                message = error;
                if (error === "Scan failed: Unable to capture fingerprint. Please kill the app in the Task Manager and restart the app.") {
                  message = '<p>' + polyglot.t("scanFailed") + '<br/><a data-role="button" id="refresh" class="btn btn-primary btn-lg" data-style="expand-right">Refresh</a></p>';
                } else {
                  message = '<p> Error: ' + error + " " + polyglot.t("scanFailed") + '<br/><a data-role="button" id="refresh" class="btn btn-primary btn-lg" data-style="expand-right">Refresh</a></p>';
                }
                $("#message").html(message);
                log = new Log();
                return log.save({
                  message: "Problem scanning fingerprint.",
                  error: error
                }, {
                  success: (function(_this) {
                    return function() {
                      $("#message").append("<br/>Saved log about problem.");
                      return console.log("Saved log about problem.");
                    };
                  })(this),
                  error: (function(_this) {
                    return function(model, err, cb) {
                      return console.log(JSON.stringify(err));
                    };
                  })(this)
                });
              });
            }
          } else {
            i = 1;
            interval = setInterval(function() {
              var serviceUuid, uuid;
              if (i === 5) {
                uuid = CoconutUtils.uuidGenerator(30);
                serviceUuid = CoconutUtils.uuidGenerator(30);
                console.log("Go to next page. Generated UUID: " + uuid);
                Coconut.scannerPayload = {
                  "Template": "46 4D 52 00 20 32 30 00 00 00 00 F0 00 00 01 04 01 2C 00 C5 00 C5 01 00 00 00 00 23 40 83 00 40 71 00 40 52 00 53 75 00 80 33 00 6B 8A 00 80 A9 00 6C 72 00 40 5B 00 81 7D 00 80 93 00 87 71 00 40 28 00 99 91 00 40 17 00 A1 11 00 40 44 00 A9 8D 00 40 81 00 B8 78 00 40 1B 00 BA 10 00 40 73 00 C2 80 00 40 3F 00 C3 94 00 40 DF 00 C7 E8 00 80 4B 00 CE 11 00 40 32 00 D6 91 00 40 16 00 D8 14 00 80 3D 00 E0 10 00 40 1A 00 E2 11 00 40 A3 00 E3 EE 00 40 38 00 F3 94 00 40 9E 00 F5 73 00 40 6D 00 FB 00 00 40 56 00 FC 93 00 40 A8 00 FC E3 00 40 26 00 FC 11 00 40 40 00 FD 10 00 40 7C 01 01 F8 00 80 C9 01 03 EA 00 40 38 01 04 9A 00 80 6D 01 07 7F 00 40 9E 01 0E 6C 00 40 32 01 10 17 00 40 88 01 11 EE 00 80 88 01 23 72 00 00 00 ",
                  "Name": "Test CK",
                  "email": "someone@somewhere.com",
                  "Finger": 1,
                  "Key": "HH8XGFYSDU9QGZ833"
                };
                Coconut.currentClient = new Result({
                  _id: uuid,
                  serviceUuid: serviceUuid
                });
                $("#message").html("Scanning complete!");
                if (user === "Admin") {
                  Coconut.currentAdmin = Coconut.currentClient;
                }
                CoconutUtils.setSession('currentAdmin', Coconut.scannerPayload.email);
                l.stop();
                if (_this.nextUrl != null) {
                  Coconut.router.navigate(_this.nextUrl, true);
                } else {
                  Coconut.router.navigate("registration", true);
                }
                clearInterval(interval);
              }
              return i++;
            }, 50);
          }
          return false;
        };
        console.log("revealSlider");
        progress = document.querySelector("paper-progress");
        button = document.querySelector("paper-button");
        startLadda(event);
        repeat = void 0;
        return maxRepeat = 5;
      };
    })(this);
    return revealSlider(event, method, user);
  },
  display: function(message) {
    var display, label, lineBreak;
    console.log("display message.");
    display = document.getElementById("message");
    lineBreak = document.createElement("br");
    label = document.createTextNode(message);
    display.appendChild(lineBreak);
    display.appendChild(label);
  },
  refresh: function() {
    Coconut.router.navigate("", false);
    return location.reload();
  },
  sendLogs: function() {
    return this.sync.sendLogs('#progress');
  },
  registerEnrolledPerson: function(serviceUuid, prints, user, createdOffline) {
    var uuid;
    if (createdOffline) {
      uuid = 'oflId-' + CoconutUtils.uuidGenerator(30);
    } else {
      uuid = CoconutUtils.uuidGenerator(30);
    }
    Coconut.currentClient = new Result({
      _id: uuid,
      serviceUuid: serviceUuid,
      Fingerprints: prints
    });
    if (createdOffline) {
      Coconut.currentClient.createdOffline = true;
    }
    if (typeof user !== 'undefined' && user !== null && user === 'Individual') {
      return Coconut.trigger("displayUserRegistrationForm");
    } else {
      return Coconut.trigger("displayAdminRegistrationForm");
    }
  },
  continueAfterFail: function() {
    var serviceUuid, user, users;
    serviceUuid = 'oflSid-' + CoconutUtils.uuidGenerator(30);
    user = this.currentOfflineUser;
    Coconut.offlineUser = true;
    console.log('Continuing after the fail. User: ' + user);
    if (user === "Admin") {
      users = new SecondaryIndexCollection;
      return users.fetch({
        fetch: 'query',
        options: {
          query: {
            include_docs: true,
            fun: 'by_AdminRegistration'
          }
        },
        success: (function(_this) {
          return function() {
            var adminUser, message, uuid;
            console.log('by_AdminRegistration returned: ' + JSON.stringify(users));
            if (users.length > 0) {
              adminUser = users.first();
              console.log('Coconut.currentAdmin: ' + JSON.stringify(adminUser));
              Coconut.currentAdmin = adminUser;
              CoconutUtils.setSession('currentAdmin', adminUser.get('email'));
              return Coconut.router.navigate("displayUserScanner", true);
            } else {
              message = 'Strange. There should already be an Admin user. ';
              console.log(message);
              $('#progress').append("<br/>" + message);
              uuid = 'oflId-' + CoconutUtils.uuidGenerator(30);
              Coconut.currentAdmin = new Result({
                _id: uuid,
                serviceUuid: serviceUuid,
                Fingerprints: Coconut.currentPrints
              });
              console.log("currentAdmin: " + JSON.stringify(Coconut.currentAdmin));
              CoconutUtils.setSession('currentAdmin', null);
              return Coconut.trigger("displayAdminRegistrationForm");
            }
          };
        })(this)
      });
    } else {
      return this.registerEnrolledPerson(serviceUuid, Coconut.currentPrints, user, true);
    }
  }
});
