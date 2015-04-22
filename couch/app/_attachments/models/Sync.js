var Sync,
  bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

Sync = (function(superClass) {
  extend(Sync, superClass);

  function Sync() {
    this.replicateApplicationDocs = bind(this.replicateApplicationDocs, this);
    this.sendLogs = bind(this.sendLogs, this);
    this.replicate = bind(this.replicate, this);
    this.populateForms = bind(this.populateForms, this);
    this.fetchOrUpdate = bind(this.fetchOrUpdate, this);
    this.getFromCloud = bind(this.getFromCloud, this);
    this.loadJSON = bind(this.loadJSON, this);
    this.saveJS = bind(this.saveJS, this);
    this.getFromJSs = bind(this.getFromJSs, this);
    this.getFromDocs = bind(this.getFromDocs, this);
    this.log = bind(this.log, this);
    this.last_get_time = bind(this.last_get_time, this);
    this.was_last_get_successful = bind(this.was_last_get_successful, this);
    this.last_send_time = bind(this.last_send_time, this);
    this.was_last_send_successful = bind(this.was_last_send_successful, this);
    this.last_send = bind(this.last_send, this);
    return Sync.__super__.constructor.apply(this, arguments);
  }

  Sync.prototype.initialize = function() {
    return this.set({
      _id: "SyncLog"
    });
  };

  Sync.prototype.url = "/sync";

  Sync.prototype.target = function() {
    return Coconut.config.cloud_url();
  };

  Sync.prototype.last_send = function() {
    return this.get("last_send_result");
  };

  Sync.prototype.was_last_send_successful = function() {
    var last_send_data;
    if (this.get("last_send_error") === true) {
      return false;
    }
    last_send_data = this.last_send();
    if (last_send_data == null) {
      return false;
    }
    if ((last_send_data.no_changes != null) && last_send_data.no_changes === true) {
      return true;
    }
    return (last_send_data.docs_read === last_send_data.docs_written) && last_send_data.doc_write_failures === 0;
  };

  Sync.prototype.last_send_time = function() {
    var result;
    result = this.get("last_send_time");
    if (result) {
      return moment(this.get("last_send_time")).fromNow();
    } else {
      return "never";
    }
  };

  Sync.prototype.was_last_get_successful = function() {
    return this.get("last_get_success");
  };

  Sync.prototype.last_get_time = function() {
    var result;
    result = this.get("last_get_time");
    if (result) {
      return moment(this.get("last_get_time")).fromNow();
    } else {
      return "never";
    }
  };

  Sync.prototype.sendToCloud = function(options) {
    return this.fetch({
      error: (function(_this) {
        return function(error) {
          return _this.log("Unable to fetch Sync doc: " + (JSON.stringify(error)));
        };
      })(this),
      success: (function(_this) {
        return function() {
          _this.log("Checking for internet. (Is " + (Coconut.config.cloud_url()) + " is reachable?) Please wait.");
          return $.ajax({
            dataType: "jsonp",
            url: Coconut.config.cloud_url(),
            error: function(error) {
              _this.log("ERROR! " + (Coconut.config.cloud_url()) + " is not reachable. Do you have enough airtime? Are you on WIFI?  Either the internet is not working or the site is down: " + (JSON.stringify(error)));
              options.error();
              return _this.save({
                last_send_error: true
              });
            },
            success: function() {
              _this.log((Coconut.config.cloud_url()) + " is reachable, so internet is available.");
              _this.log("Creating list of all results on the tablet. Please wait.");
              return $.couch.db(Coconut.config.database_name()).view((Coconut.config.design_doc_name()) + "/results", {
                include_docs: false,
                error: function(result) {
                  _this.log("Could not retrieve list of results: " + (JSON.stringify(error)));
                  options.error();
                  return _this.save({
                    last_send_error: true
                  });
                },
                success: function(result) {
                  var resultIDs;
                  _this.log("Synchronizing " + result.rows.length + " results. Please wait.");
                  resultIDs = _.pluck(result.rows, "id");
                  return $.couch.db(Coconut.config.database_name()).saveDoc({
                    collection: "log",
                    action: "sendToCloud",
                    user: User.currentUser.id,
                    time: moment().format(Coconut.config.get("date_format"))
                  }, {
                    error: function(error) {
                      return _this.log("Could not create log file: " + (JSON.stringify(error)));
                    },
                    success: function() {
                      $.couch.replicate(Coconut.config.database_name(), Coconut.config.cloud_url_with_credentials(), {
                        success: function(result) {
                          _this.log("Send data finished: created, updated or deleted " + result.docs_written + " results on the server.");
                          _this.save({
                            last_send_result: result,
                            last_send_error: false,
                            last_send_time: new Date().getTime()
                          });
                          return _this.sendLogMessagesToCloud({
                            success: function() {
                              return options.success();
                            },
                            error: function(error) {
                              this.save({
                                last_send_error: true
                              });
                              return options.error(error);
                            }
                          });
                        }
                      }, {
                        doc_ids: resultIDs
                      });
                      return Coconut.menuView.checkReplicationStatus();
                    }
                  });
                }
              });
            }
          });
        };
      })(this)
    });
  };

  Sync.prototype.log = function(message) {
    return Coconut.debug(message);
  };

  Sync.prototype.sendLogMessagesToCloud = function(options) {
    return this.fetch({
      error: (function(_this) {
        return function(error) {
          return _this.log("Unable to fetch Sync doc: " + (JSON.stringify(error)));
        };
      })(this),
      success: (function(_this) {
        return function() {
          return $.couch.db(Coconut.config.database_name()).view((Coconut.config.design_doc_name()) + "/byCollection", {
            key: "log",
            include_docs: false,
            error: function(error) {
              _this.log("Could not retrieve list of log entries: " + (JSON.stringify(error)));
              options.error(error);
              return _this.save({
                last_send_error: true
              });
            },
            success: function(result) {
              var logIDs;
              _this.log("Sending " + result.rows.length + " log entries. Please wait.");
              logIDs = _.pluck(result.rows, "id");
              $.couch.replicate(Coconut.config.database_name(), Coconut.config.cloud_url_with_credentials(), {
                success: function(result) {
                  _this.save({
                    last_send_result: result,
                    last_send_error: false,
                    last_send_time: new Date().getTime()
                  });
                  _this.log("Successfully sent " + result.docs_written + " log messages to the server.");
                  return options.success();
                },
                error: function(error) {
                  _this.log("Could not send log messages to the server: " + (JSON.stringify(error)));
                  _this.save({
                    last_send_error: true
                  });
                  return typeof options.error === "function" ? options.error(error) : void 0;
                }
              }, {
                doc_ids: logIDs
              });
              return Coconut.menuView.checkReplicationStatus();
            }
          });
        };
      })(this)
    });
  };

  Sync.prototype.getFromDocs = function(options) {
    var file, fileList, i, len, results;
    fileList = ['admin_registration.js', 'individual_registration.js', 'post_operative_followup.js', 'trichiasis_surgery.js', 'user.admin.js', 'test_client.js'];
    results = [];
    for (i = 0, len = fileList.length; i < len; i++) {
      file = fileList[i];
      results.push(this.loadJSON('/docs/' + file));
    }
    return results;
  };

  Sync.prototype.getFromJSs = function(options) {
    var i, item, len, list, results;
    list = [adminRegistrationForm, trichiasisForm, userAdminForm, individualRegistrationForm, postOperativeFollowupForm, testClient];
    results = [];
    for (i = 0, len = list.length; i < len; i++) {
      item = list[i];
      results.push(this.saveJS(item));
    }
    return results;
  };

  Sync.prototype.saveJS = function(json) {
    var savedQuestion;
    savedQuestion = new Result;
    savedQuestion.collection = 'question';
    return savedQuestion.save(json, {
      success: function() {
        return console.log('json saved for ' + savedQuestion.get("_id"));
      },
      error: function(model, err, cb) {
        console.log("Error: " + JSON.stringify(err));
        return console.log(new Error().stack);
      }
    });
  };

  Sync.prototype.loadJSON = function(file) {
    return $.ajax('file', {
      type: 'GET',
      dataType: 'jsonp',
      error: function(jqXHR, textStatus, errorThrown) {
        $('body').append("AJAX Error: " + textStatus);
        return console.log("Error: " + textStatus);
      },
      success: function(data, textStatus, jqXHR) {
        var savedQuestion;
        console.log(file + 'retrieved');
        savedQuestion = new Result;
        savedQuestion.collection = 'question';
        return savedQuestion.save(data, {
          success: function() {
            return console.log(file + 'saved');
          },
          error: function(model, err, cb) {
            console.log("Error: " + JSON.stringify(err));
            return console.log(new Error().stack);
          }
        });
      }
    });
  };

  Sync.prototype.getFromCloud = function(options) {
    return this.fetch({
      error: (function(_this) {
        return function(error) {
          return _this.log("Unable to fetch Sync doc: " + (JSON.stringify(error)));
        };
      })(this),
      success: (function(_this) {
        return function() {
          _this.log("Checking that " + (Coconut.config.cloud_url()) + " is reachable. Please wait.");
          return $.ajax({
            dataType: "jsonp",
            url: Coconut.config.cloud_url(),
            error: function(error) {
              _this.log("ERROR! " + (Coconut.config.cloud_url()) + " is not reachable. Do you have enough airtime? Are you on WIFI?  Either the internet is not working or the site is down: " + (JSON.stringify(error)));
              return typeof options.error === "function" ? options.error(error) : void 0;
            },
            success: function() {
              _this.log((Coconut.config.cloud_url()) + " is reachable, so internet is available.");
              return _this.fetch({
                success: function() {
                  _this.log("Updating users, forms and the design document. Please wait.");
                  return _this.replicateApplicationDocs({
                    error: function(error) {
                      $.couch.logout();
                      _this.log("ERROR updating application: " + (JSON.stringify(error)));
                      _this.save({
                        last_get_success: false
                      });
                      return options != null ? typeof options.error === "function" ? options.error(error) : void 0 : void 0;
                    },
                    success: function() {
                      console.log("TODO: enable User.currentUser.id");
                      return _.delay(function() {
                        return document.location.reload();
                      }, 2000);
                    }
                  });
                }
              });
            }
          });
        };
      })(this)
    });
  };

  Sync.prototype.replicateFromServer = function(options) {
    var filter, opts;
    if (!options) {
      options = {};
    }
    filter = function(doc) {
      if (doc._id !== "_design/by_clientId" && doc._id !== "_design/by_serviceUuid" && doc._id !== "SyncLog" && doc._id !== "coconut.config" && doc._id !== "coconut.config.local" && doc._id !== "version" && doc.noClientPush !== "true") {
        return doc;
      }
    };
    opts = {
      live: true,
      filter: filter,
      withCredentials: true,
      complete: function(result) {
        if (typeof result !== 'undefined' && result !== null && result.ok) {
          return Coconut.debug("replicateFromServer - onComplete: Replication is fine. ");
        } else {
          if (result !== null && typeof result !== 'undefined') {
            Coconut.debug("replicateFromServer - onComplete: Replication message: " + JSON.stringify(result.message));
            if (result.status !== 500) {
              return Coconut.debug("replicateFromServer - onComplete: Replication result: " + JSON.stringify(result));
            }
          } else {
            return Coconut.debug("replicateFromServer - onComplete: Replication message: " + JSON.stringify(result));
          }
        }
      },
      error: function(result) {
        return Coconut.debug("error: Replication error: " + JSON.stringify(result));
      },
      timeout: 60000
    };
    _.extend(options, opts);
    return Backbone.sync.defaults.db.replicate.from(Coconut.config.cloud_url_with_credentials(), options).on('uptodate', function(result) {
      if (typeof result !== 'undefined' && result.ok) {
        console.log("uptodate: Replication is fine. ");
        options.complete();
        if (typeof options.success !== 'undefined') {
          return options.success();
        }
      } else {
        return console.log("uptodate: Replication error: " + JSON.stringify(result));
      }
    }).on('change', function(info) {
      return Coconut.debug("Change: " + JSON.stringify(info));
    }).on('complete', function(info) {
      return Coconut.debug("Complete: " + JSON.stringify(info));
    });
  };

  Sync.prototype.replicateForms = function(options) {
    var opts;
    console.log("coconut_forms_url: " + Coconut.config.coconut_forms_url_with_credentials());
    if (!options) {
      options = {};
    }
    opts = {
      live: true,
      withCredentials: true,
      complete: function(result) {
        if (typeof result !== 'undefined' && result !== null && result.ok) {
          return Coconut.debug("replicateFromServer - onComplete: Replication is fine. ");
        } else {
          return Coconut.debug("replicateFromServer - onComplete: Replication message: " + JSON.stringify(result));
        }
      },
      error: function(result) {
        return Coconut.debug("error: Replication error: " + JSON.stringify(result));
      },
      timeout: 60000
    };
    _.extend(options, opts);
    return Backbone.sync.defaults.db.replicate.from(Coconut.config.coconut_forms_url_with_credentials(), options).on('uptodate', function(result) {
      if (typeof result !== 'undefined' && result.ok) {
        console.log("uptodate: Form Replication is fine. ");
        Coconut.syncView.sync.populateForms();
        options.complete();
        if (typeof options.success !== 'undefined') {
          return options.success();
        }
      } else {
        return console.log("uptodate: Form Replication error: " + JSON.stringify(result));
      }
    }).on('change', function(info) {
      return Coconut.debug("Form Replication Change: " + JSON.stringify(info));
    }).on('complete', function(info) {
      return Coconut.debug("Form Replication Complete: " + JSON.stringify(info));
    });
  };

  Sync.prototype.fetchOrUpdate = function(obj) {
    return new Promise((function(_this) {
      return function(resolve, reject) {
        var model;
        model = new Backbone.Model({
          _id: obj._id
        });
        return model.fetch({
          success: function(oldModel) {
            var _rev, objModel;
            _rev = oldModel.get("_rev");
            obj._rev = _rev;
            objModel = new Backbone.Model({
              _id: obj._id,
              _rev: _rev
            });
            objModel.save(obj, {
              success: function(updatedModel) {
                return console.log('Updating... ' + updatedModel.get("_id"));
              },
              error: function(model, resp) {
                return console.log('Error: ' + resp);
              }
            });
            return resolve(oldModel);
          },
          error: function(model, resp) {
            console.log('Error: ' + obj._id + " : " + JSON.stringify(resp));
            reject('Error: ' + obj._id + " : " + JSON.stringify(resp));
            if (resp.status === 404) {
              return model.save(obj, {
                success: function(model) {
                  return console.log('Saving... ' + model.get("_id"));
                },
                error: function(model, resp) {
                  return console.log('Error: ' + resp);
                }
              });
            }
          }
        });
      };
    })(this));
  };

  Sync.prototype.populateForms = function() {
    var model;
    model = new Backbone.Model({
      _id: Coconut.config.coconut_forms_design_doc()
    });
    return model.fetch({
      options: {
        get: {
          attachments: true
        }
      }
    }).then((function(_this) {
      return function(result) {
        var attachment, decodedData, key, obj, promises;
        promises = (function() {
          var results;
          results = [];
          for (key in result._attachments) {
            attachment = result._attachments[key];
            decodedData = decodeURIComponent(escape(window.atob(attachment.data)));
            obj = JSON.parse(decodedData);
            console.log("key: " + key + ":" + obj._id);
            results.push(this.fetchOrUpdate(obj));
          }
          return results;
        }).call(_this);
        return Promise.all(promises);
      };
    })(this));
  };

  Sync.prototype.replicate = function(messageId) {
    return this.replicateToServer({
      success: function() {
        $(messageId).append("<br/>Data sent to the server.<br/>");
        return this.sync.replicateFromServer({
          success: function() {
            return $(messageId).append("Data received from the server.<br/>");
          },
          error: function(json, error) {
            return $(messageId).append("Error receiving data to the server. Error: " + error + "<br/>");
          }
        });
      },
      error: function(json, error) {
        return $(messageId).append("Error sending data to the server. Error: " + error + "<br/>");
      }
    });
  };

  Sync.prototype.sendLogs = function(messageId) {
    return logger.getLogs(null, 100, (function(_this) {
      return function(log) {
        var completeLog, versionText;
        console.log("Generated logs");
        versionText = "Kiwi App version: " + Coconut.version_code + ".\n";
        completeLog = versionText.concat(log);
        CoconutUtils.saveLog(null, "Logcat log", completeLog);
        $('#progress').append("<br/>Logs saved. Data will now be replicated with the server.<br/>");
        return _this.replicate(messageId);
      };
    })(this));
  };

  Sync.prototype.replicateToServer = function(options) {
    var filter, opts;
    if (!options) {
      options = {};
    }
    filter = function(doc) {
      if (doc._id !== "_design/by_clientId" && doc._id !== "_design/by_serviceUuid" && doc._id !== "SyncLog" && doc._id !== "coconut.config" && doc._id !== "coconut.config.local" && doc._id !== "version" && doc.noClientPush !== "true") {
        return doc;
      }
    };
    opts = {
      live: true,
      continuous: true,
      filter: filter,
      withCredentials: true,
      complete: function(result) {
        if (typeof result !== 'undefined' && result !== null && result.ok) {
          return Coconut.debug("replicateToServer - onComplete: Replication is fine. ");
        } else {
          return Coconut.debug("replicateToServer - onComplete: Replication message: " + JSON.stringify(result));
        }
      },
      error: function(result) {
        return Coconut.debug("error: Replication error: " + JSON.stringify(result));
      },
      timeout: 60000
    };
    _.extend(options, opts);
    return Backbone.sync.defaults.db.replicate.to(Coconut.config.cloud_url_with_credentials(), options).on('uptodate', function(result) {
      if (typeof result !== 'undefined' && result.ok) {
        console.log("uptodate: Replication is fine. ");
        options.complete();
        if (typeof options.success !== 'undefined') {
          return options.success();
        }
      } else {
        return console.log("uptodate: Replication error: " + JSON.stringify(result));
      }
    }).on('change', function(info) {
      return Coconut.debug("Change: " + JSON.stringify(info));
    }).on('complete', function(info) {
      return Coconut.debug("Complete: " + JSON.stringify(info));
    });
  };

  Sync.prototype.replicateApplicationDocs = function(options) {
    return $.ajax({
      dataType: "jsonp",
      url: (Coconut.config.cloud_url_with_credentials()) + "/_design/" + (Coconut.config.design_doc_name()) + "/_view/docIDsForUpdating",
      include_docs: false,
      error: (function(_this) {
        return function(a, b, error) {
          return typeof options.error === "function" ? options.error(error) : void 0;
        };
      })(this),
      success: (function(_this) {
        return function(result) {
          var doc_ids;
          doc_ids = _.pluck(result.rows, "id");
          console.log(JSON.stringify(doc_ids));
          _this.log("Updating " + doc_ids.length + " docs (users, forms and the design document). Please wait.");
          return _this.replicateFromServer(_.extend(options, {
            replicationArguments: {
              doc_ids: doc_ids
            }
          }));
        };
      })(this)
    });
  };

  return Sync;

})(Backbone.Model);
