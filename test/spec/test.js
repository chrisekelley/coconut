(function() {
  'use strict';
  var Tangerine, dbs, tests;
  if (Mocha.process.browser) {
    dbs = 'testdb' + Math.random();
  } else {
    dbs = Mocha.process.env.TEST_DB;
  }
  Tangerine = {};
  tests = function(dbName) {
    var async;
    console.log("running tests.");
    async = function(functions, callback) {
      series(functions)(function() {
        var fn;
        callback = callback || function() {};
        if (!functions.length) {
          return callback();
        }
        fn = functions.shift();
        return fn.call(fn, function(err) {
          if (err) {
            callback(err);
            return;
          }
          return series(functions);
        });
      });
      return series(functions);
    };
    return describe('Should setup the pouch and run the tests', function() {
      this.timeout(10000);
      dbs = [];
      before('Setup Tangerine and Pouch', function(done) {
        var pouchName;
        console.log("before");
        this.$container = $("#view-test-container");
        this.$fixture = $("<div>", {
          id: "fixture"
        });
        this.timeout(5000);
        pouchName = dbName;
        dbs = [dbName];
        return Tangerine.db = new PouchDB(pouchName, {
          adapter: 'memory'
        }, function(err) {
          if (err) {
            console.log("Before: I got an error: " + err);
            return done(err);
          } else {
            return done();
          }
        });
      });
      return it('Test connectivity with AFIS', function(done) {
        var payload, results, timeout, urlServer;
        results = "46 4D 52 00 20 32 30 00 00 00 00 F0 00 00 01 04 01 2C 00 C5 00 C5 01 00 00 00 00 23 40 83 00 40 71 00 40 52 00 53 75 00 80 33 00 6B 8A 00 80 A9 00 6C 72 00 40 5B 00 81 7D 00 80 93 00 87 71 00 40 28 00 99 91 00 40 17 00 A1 11 00 40 44 00 A9 8D 00 40 81 00 B8 78 00 40 1B 00 BA 10 00 40 73 00 C2 80 00 40 3F 00 C3 94 00 40 DF 00 C7 E8 00 80 4B 00 CE 11 00 40 32 00 D6 91 00 40 16 00 D8 14 00 80 3D 00 E0 10 00 40 1A 00 E2 11 00 40 A3 00 E3 EE 00 40 38 00 F3 94 00 40 9E 00 F5 73 00 40 6D 00 FB 00 00 40 56 00 FC 93 00 40 A8 00 FC E3 00 40 26 00 FC 11 00 40 40 00 FD 10 00 40 7C 01 01 F8 00 80 C9 01 03 EA 00 40 38 01 04 9A 00 80 6D 01 07 7F 00 40 9E 01 0E 6C 00 40 32 01 10 17 00 40 88 01 11 EE 00 80 88 01 23 72 00 00 00 ";
        payload = {};
        payload["Key"] = "HH8XGFYSDU9QGZ833";
        payload["Name"] = "Kiwi-Moz-Test";
        payload["Template"] = results;
        payload["Finger"] = 1;
        payload["District"] = "Test";
        urlServer = "http://localhost:443/" + "afis.simprints.com/" + "api/Person/" + "Identify";
        timeout = 15000;
        $.ajaxSetup({
          type: 'POST',
          timeout: timeout,
          error: (function(_this) {
            return function(xhr) {
              return console.log("");
            };
          })(this)
        });
        return $.post(urlServer, payload, (function(_this) {
          return function(result) {
            console.log("response from service: " + JSON.stringify(result));
            return done();
          };
        })(this));
      });
    });
  };
  return dbs.split(',').forEach(function(db) {
    return tests(db);
  });
})();
