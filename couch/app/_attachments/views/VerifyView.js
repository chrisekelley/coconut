var VerifyView,
  hasProp = {}.hasOwnProperty;

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
    "click #continueAfterFail": "continueAfterFail",
    "click #submitUserLogin": "submitUserLogin",
    "click #searchByID": "searchByID",
    "click #searchByDOB": "searchByDOB",
    "click #searchButton": "displaySearchPage",
    "click .loadPatientView": "searchByIDclicked"
  },
  nextUrl: null,
  hasCordova: true,
  currentOfflineUser: null,
  initialize: function() {
    var adminRegCollection, adminRegdropdown, district, districtJson, districtList, index, key, phrase, user, viewOptions;
    this.sync = new Sync();
    if (typeof cordova === "undefined") {
      this.hasCordova = false;
    }
    districtJson = KiwiUtils.districts;
    districtList = [];
    index = 0;
    for (key in districtJson) {
      if (!hasProp.call(districtJson, key)) continue;
      phrase = districtJson[key];
      if (key !== '_id' && key !== 'id' && key !== '_rev' && key !== 'noClientPush') {
        index++;
        district = {
          id: key,
          name: phrase
        };
        districtList.push(district);
      }
    }
    this.districts = districtList;
    if (!this.hasCordova) {
      if (this.options.user === "Admin") {
        user = this.options.user;
        viewOptions = {};
        adminRegdropdown = "";
        adminRegCollection = new SecondaryIndexCollection;
        return adminRegCollection.fetch({
          fetch: 'query',
          options: {
            query: {
              include_docs: true,
              fun: 'by_AdminRegistration'
            }
          },
          success: (function(_this) {
            return function() {
              adminRegdropdown = "\n<div class=\"form-group\">\n\t<select id=\"formDropdown\" class=\"form-control\">\n<option value=\"\"> -- " + polyglot.t("SelectOne") + " -- </option>\n";
              adminRegCollection.each(function(adminReg) {
                var id, name, option;
                id = adminReg.get("_id");
                name = adminReg.get("Name");
                option = "<option value=\"" + id + "\">" + name + "</option>\n";
                return adminRegdropdown = adminRegdropdown + option;
              });
              adminRegdropdown = adminRegdropdown + "\t</select>\n</div>\n";
              $("#adminDropdown").css({
                "display": "block"
              });
              $("#submitUserLogin").css({
                "display": "block"
              });
              return $("#submitUserLoginMessage").html(adminRegdropdown);
            };
          })(this),
          error: function(model, err, cb) {
            return console.log(JSON.stringify(err));
          }
        });
      }
    }
  },
  districts: null,
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
    var district;
    district = $('#District').val();
    if (district === '') {
      return alert(polyglot.t("districtRequired"));
    }
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
          findUserFromServiceUUID = function(serviceUuid, prints, threshold) {
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
                  var adminUser, message, uuid;
                  console.log('by_serviceUuid returned: ' + JSON.stringify(users));
                  l.stop();
                  if (users.length > 0) {
                    if (user === "Admin") {
                      adminUser = users.first();
                      Coconut.currentAdmin = adminUser;
                      CoconutUtils.setSession('currentAdmin', adminUser.get('email'));
                      return Coconut.router.navigate("displayUserScanner", true);
                    } else {
                      user = users.first();
                      return sendClientToRecords(user, threshold);
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
              cordova.plugins.SecugenPlugin.scanFile(function(results) {
                var binary, district, finger, fingerprint, ft, i, image, j, lastModifiedAt, len, options, params, payload, postError, postSuccess, prints, ref, template, timeout, urlServer;
                finger = $('#Finger').val();
                district = $('#District').val();
                binary = '';
                len = results.byteLength;
                for (i = j = 0, ref = len; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
                  binary += String.fromCharCode(results[i]);
                }
                image = window.btoa(binary);
                payload = {};
                payload["Key"] = Coconut.config.get("AfisServerKey");
                payload["Name"] = Coconut.config.get("AfisProjectName");
                payload["Template"] = image;
                payload["Finger"] = finger;
                payload["District"] = district;
                lastModifiedAt = Date.now();
                options = new FileUploadOptions();
                options.fileKey = "file";
                options.fileName = district + lastModifiedAt;
                options.mimeType = "image/png";
                params = {};
                params.key = Coconut.config.get("AfisServerKey");
                options.params = params;
                ft = new FileTransfer();
                template = payload.Template;
                fingerprint = {};
                fingerprint.template = template;
                fingerprint.finger = finger;
                fingerprint.district = district;
                prints = [];
                prints.push(fingerprint);
                Coconut.currentPrints = prints;
                if (typeof district !== 'undefined') {
                  Coconut.currentDistrict = district;
                }
                urlServer = Coconut.config.get("AfisServerUrl") + Coconut.config.get("AfisServerUrlFilepath");
                timeout = Coconut.config.get("networkTimeout");
                if (typeof Coconut.networkTimeout !== 'undefined') {
                  timeout = Coconut.networkTimeout;
                }
                $('#progress').append("<br/>Fingerprint scanned. Now uploading to server. User: " + user);
                $('#progress').append("<br/>Server URL: " + urlServer);
                $('#progress').append("<br/>Timeout: " + timeout);
                postSuccess = function(result) {
                  var error, log, response, scannerPayload, serviceUuid, statusCode, threshold;
                  console.log("response from service: " + JSON.stringify(result));
                  $('#progress').append("<br/>Received response from service.");
                  try {
                    if (typeof result.response !== "undefined") {
                      response = JSON.parse(result.response);
                      scannerPayload = payload["Template"];
                      statusCode = response.StatusCode;
                      serviceUuid = response.UID;
                      threshold = response.Threshold;
                      $('#progress').append("<br/>StatusCode: " + statusCode);
                      console.log('StatusCode: ' + statusCode + 'query for serviceUuid: ' + serviceUuid);
                    }
                  } catch (_error) {
                    error = _error;
                    console.log(error);
                    $('#progress').append("<br/>Error uploading scan: " + error);
                  }
                  if (statusCode !== null && statusCode === 1) {
                    $('#progress').append("<br/>Locating user in local database.");
                    return findUserFromServiceUUID(serviceUuid, prints, threshold);
                  } else if (statusCode !== null && statusCode === 4) {
                    $('#progress').append("<br/>User not in the local database.");
                    l.stop();
                    if (user === 'Admin') {
                      CoconutUtils.setSession('currentAdmin', null);
                    } else {
                      CoconutUtils.setSession('currentClient', true);
                    }
                    $('#progress').append("<br/>Fingerprint enrolled. Success! User: " + user);
                    return _this.registerEnrolledPerson(serviceUuid, prints, user, false, threshold);
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
                };
                postError = function(xhr, textStatus, errorThrown) {
                  var adminRegCollection, adminRegdropdown, viewOptions;
                  console.log("Error: " + JSON.stringify(xhr) + " textStatus: " + textStatus + " errorThrown: " + errorThrown);
                  l.stop();
                  this.currentOfflineUser = user;
                  viewOptions = {};
                  adminRegdropdown = "";
                  adminRegCollection = new SecondaryIndexCollection;
                  return adminRegCollection.fetch({
                    fetch: 'query',
                    options: {
                      query: {
                        include_docs: true,
                        fun: 'by_AdminRegistration'
                      }
                    },
                    success: (function(_this) {
                      return function() {
                        var message;
                        console.log("Retrieved Admin registrations: " + JSON.stringify(adminRegCollection));
                        adminRegdropdown = "\n<div class=\"form-group\">\n\t<select id=\"formDropdown\" class=\"form-control\">\n<option value=\"\"> -- " + polyglot.t("SelectOne") + " -- </option>\n";
                        adminRegCollection.each(function(adminReg) {
                          var id, name, option;
                          id = adminReg.get("_id");
                          name = adminReg.get("Name");
                          option = "<option value=\"" + id + "\">" + name + "</option>\n";
                          return adminRegdropdown = adminRegdropdown + option;
                        });
                        adminRegdropdown = adminRegdropdown + "\t</select>\n</div>\n";
                        if (user === 'Admin') {
                          message = polyglot.t("errorUploadingScan") + ": " + xhr.statusText + " . " + polyglot.t("offlineScanContinueAdmin");
                          $("#uploadFailedMessage").html(message + adminRegdropdown);
                        } else {
                          message = polyglot.t("errorUploadingScan") + ": " + xhr.statusText + " . " + polyglot.t("offlineScanContinueNewPatient");
                          $("#uploadFailedMessage").html(message);
                        }
                        $("#uploadFailed").css({
                          "display": "block"
                        });
                        console.log(message);
                        console.log("Fingerprint server URL: " + urlServer);
                        return $('#progress').append(message);
                      };
                    })(this),
                    error: function(model, err, cb) {
                      return console.log(JSON.stringify(err));
                    }
                  });
                };
                return ft.upload(results, urlServer, postSuccess, postError, options);
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
              var district, serviceUuid, uuid;
              if (i === 5) {
                uuid = CoconutUtils.uuidGenerator(30);
                serviceUuid = CoconutUtils.uuidGenerator(30);
                district = $('#District').val();
                if (user === "Admin") {
                  Coconut.currentDistrict = district;
                }
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
                  window.setTimeout(function() {
                    return Coconut.router.navigate("registration");
                  }, 2000);
                }
                clearInterval(interval);
              }
              return i++;
            }, 50);
          }
          return false;
        };
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
  registerEnrolledPerson: function(serviceUuid, prints, user, createdOffline, threshold) {
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
    var formDropdownValue, serviceUuid, user, users;
    serviceUuid = 'oflSid-' + CoconutUtils.uuidGenerator(30);
    user = this.currentOfflineUser;
    Coconut.offlineUser = true;
    console.log('Continuing after the fail. User: ' + user);
    formDropdownValue = $('#formDropdown').val();
    if (formDropdownValue === "") {
      return alert(polyglot.t("selectFromFormDropdown"));
    }
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
            if (users.length > 0) {
              adminUser = users._byId[formDropdownValue];
              if (adminUser === null) {
                return alert(polyglot.t("Problem finding an Admin user. Have any users registerred on this tablet?"));
              }
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
      return this.registerEnrolledPerson(serviceUuid, Coconut.currentPrints, user, true, null);
    }
  },
  submitUserLogin: function() {
    var formDropdownValue, serviceUuid, users;
    serviceUuid = 'adminSid-' + CoconutUtils.uuidGenerator(30);
    formDropdownValue = $('#formDropdown').val();
    if (formDropdownValue === "") {
      return alert(polyglot.t("selectFromFormDropdown"));
    }
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
          if (users.length > 0) {
            adminUser = users._byId[formDropdownValue];
            if (adminUser === null) {
              return alert(polyglot.t("Problem finding an Admin user. Have any users registerred on this tablet?"));
            }
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
  },
  searchByID: function() {
    var error, id, success, users;
    Coconut.idResults.reset();
    Coconut.dobResults.reset();
    id = $('#id').val();
    success = (function(_this) {
      return function(users) {
        var tableView;
        Coconut.searchUsers = {};
        Coconut.searchUsers = users;
        tableView = new UserSearchResultCompositeView({
          collection: users
        });
        return Coconut.idResults.show(tableView);
      };
    })(this);
    error = function(model, err, cb) {
      console.log(JSON.stringify(err));
      return $('#idResults').append("Search error: " + err);
    };
    return users = KiwiUtils.searchForUser('by_clientIdIndivReg', success, error, id);
  },
  searchByDOB: function() {
    var dob, error, gender, success, users;
    Coconut.idResults.reset();
    Coconut.dobResults.reset();
    dob = $('#dob').val();
    gender = $('#Gender').val();
    console.log("Searching for dob" + dob);
    success = (function(_this) {
      return function(users) {
        var tableView;
        Coconut.searchUsers = {};
        Coconut.searchUsers = users;
        tableView = new UserSearchResultCompositeView({
          collection: users
        });
        return Coconut.dobResults.show(tableView);
      };
    })(this);
    error = function(model, err, cb) {
      console.log(JSON.stringify(err));
      return $('#dobResults').append("Search error: " + err);
    };
    return users = KiwiUtils.searchForUser('by_DOBGenderIndivReg', success, error, dob, gender);
  },
  displaySearchPage: function() {
    return Coconut.trigger("displaySearch");
  }
});
