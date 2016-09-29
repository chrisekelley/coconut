(() ->
  'use strict'

  if Mocha.process.browser
    dbs = 'testdb' + Math.random()
  else
    dbs = Mocha.process.env.TEST_DB

  Tangerine = {}

  tests = (dbName)->
    console.log("running tests.")
    #    // async method takes an array of s of signature:
    #    // `function (cb) {}`
    #    // each function is called and `callback` is called when all
    #    // functions are done.
    #    // each function calls `cb` to signal completion
    #    // cb is called with error as the first arguments (if any)
    #    // Once all functions are completed (or upon err)
    #    // callback is called `callback(err)`
    async = (functions, callback) ->
      series(functions) ->
        callback = callback || () ->
        if !functions.length
          return callback()

        fn = functions.shift();
        fn.call(fn, (err)->
          if err
            callback(err)
            return
          series(functions)
        )
      series(functions)

    describe 'Should setup the pouch and run the tests', ()->
      this.timeout(10000);

      dbs = [];

      before( 'Setup Tangerine and Pouch',(done) ->
        console.log("before")
        this.$container = $("#view-test-container");
        this.$fixture = $("<div>", { id: "fixture" });
        this.timeout(5000);

        pouchName = dbName;
        dbs = [dbName];
        #    // create db
        Tangerine.db = new PouchDB(pouchName, {adapter: 'memory'}, (err) ->
          #          console.log("Before: Created Pouch: " + pouchName)
          if (err)
            console.log("Before: I got an error: " + err)
            return done(err)
          else
            return done()
        )
      )

#      after('Teardown Pouch', (done) ->
#        console.log("after")
#        this.$container.empty();
#        delete this.$fixture;
#
#        this.timeout(15000);
#        pouchName = dbName;
#        dbs = [dbName];
#
#        result = Tangerine.db.destroy((er) ->
#          ).then( (er) ->
#            console.log("After: Destroyed db: " + JSON.stringify(result) + " er: " + JSON.stringify er)
#            done()
#          ).catch( (er) ->
#            console.log("After: Problem destroying db: " + er)
#            done(er)
#          )
#      )

      it('Test connectivity with AFIS', (done)->

#        db = Tangerine.db

        results = "46 4D 52 00 20 32 30 00 00 00 00 F0 00 00 01 04 01 2C 00 C5 00 C5 01 00 00 00 00 23 40 83 00 40 71 00 40 52 00 53 75 00 80 33 00 6B 8A 00 80 A9 00 6C 72 00 40 5B 00 81 7D 00 80 93 00 87 71 00 40 28 00 99 91 00 40 17 00 A1 11 00 40 44 00 A9 8D 00 40 81 00 B8 78 00 40 1B 00 BA 10 00 40 73 00 C2 80 00 40 3F 00 C3 94 00 40 DF 00 C7 E8 00 80 4B 00 CE 11 00 40 32 00 D6 91 00 40 16 00 D8 14 00 80 3D 00 E0 10 00 40 1A 00 E2 11 00 40 A3 00 E3 EE 00 40 38 00 F3 94 00 40 9E 00 F5 73 00 40 6D 00 FB 00 00 40 56 00 FC 93 00 40 A8 00 FC E3 00 40 26 00 FC 11 00 40 40 00 FD 10 00 40 7C 01 01 F8 00 80 C9 01 03 EA 00 40 38 01 04 9A 00 80 6D 01 07 7F 00 40 9E 01 0E 6C 00 40 32 01 10 17 00 40 88 01 11 EE 00 80 88 01 23 72 00 00 00 ";

        payload =  {}
        payload["Key"] = "HH8XGFYSDU9QGZ833"
        payload["Name"] = "Kiwi-Moz-Test"
        payload["Template"] = results
        payload["Finger"] = 1
        payload["District"] = "Test"

        urlServer = "http://localhost:443/" + "afis.simprints.com/"  + "api/Person/" + "Identify";
#        urlServer = "https://localhost:1337/" + "afis.simprints.com/"  + "api/Person/" + "Identify";
        #                timeout = 15000
        timeout = 15000

        $.ajaxSetup
          type:'POST'
          timeout:timeout
          error: (xhr)=>
            console.log("")

        $.post(urlServer, payload,
          (result) =>
            console.log "response from service: " + JSON.stringify result
            done()
        )
      )

  dbs.split(',').forEach((db) ->
    # dbType = /^http/.test(db) ? 'http' : 'local'
    tests db
  )


)()