module.exports = function(grunt) {

    /*
     * https://github.com/gruntjs/grunt/wiki/Configuring-tasks
     */
    grunt.initConfig({
        dirs: {
            handlebars: 'couch/app/_attachments/templates'
        },
        watch: {
            handlebars: {
                files: ['<%= handlebars.compile.src %>'],
                tasks: ['handlebars:compile']
            },
            less: {
                files: ['couch/app/_attachments/bower_components/bootstrap/less/*.less'],
                tasks: ['less']
            },
            coffee: {
              files: ['couch/app/_attachments/**/*.coffee','couch/app/lists/**/*.coffee','couch/app/views/**/*.coffee'],
              tasks: ['coffee', 'couch']
            },
            docs: {
              files: ['docs/**/*'],
              tasks: ['couch']
            },
            configFiles: {
              files: [ 'Gruntfile.js']
            }
        },
        handlebars: {
            compile: {
                options: {
                    amd: false,
                  processName: function(filePath) {
                    var nuPath = filePath.replace("couch/app/", "")
                    return nuPath;
                  }
                },
              src: ["couch/app/_attachments/templates/**/*.handlebars"],
                dest: "couch/app/_attachments/templates/precompiled.handlebars.js"
            }
        },
        less: {
            development: {
                options: {
                    paths: ["couch/app/attachments/bower_components/bootstrap/less", "couch/app/_attachments/bower_components/bootstrap/dist/css"],
                    cleancss: true,
                    yuicompress: true,
                    compress: true,
                    sourceMap: true,
                    sourceMapFilename: "couch/app/_attachments/bower_components/bootstrap/dist/css/bootstrap.css.map",
                    sourceMapBasepath: "couch/app/_attachments/bower_components/bootstrap/dist/css/"
                },
                files: {
                    "couch/app/_attachments/bower_components/bootstrap/dist/css/bootstrap.css": "couch/app/_attachments/bower_components/bootstrap/less/bootstrap.less"
                }
            }
        },
        coffee: {
          compile: {
            options: {
              bare: true
            },
            expand: true,
            flatten: false,
            cwd: "couch/app/_attachments",
            src: ["**/*.coffee"],
            dest: 'couch/app/_attachments',
            ext: ".js"
          }
        },
        'couch-compile': {
          app: {
            //files: [
            //  {src: ['couch/*', '!*.coffee', '!bar.js','!couch/bar.js', '!couch/full/bar.js'], dest: 'tmp/app.json'},
            //  {src: ['docs/*'], dest: 'tmp/forms.json'}
            //]
            files: {
              'tmp/app.json': 'couch/*',
              'tmp/forms.json': 'docs/*'
            }
          }
        },
        'couch-push': {
          options: {
            user: 'admin',
            pass: 'password'
          },
          localhost: {
            files: {
              'http://localhost:5984/coconut': 'tmp/app.json',
              'http://localhost:5984/coconut-forms': 'tmp/forms.json'
            }
          }
        },
        bowercopy: {
          options: {},
          libs: {
            options: {
              destPrefix: 'couch/app/_attachments/js'
            },
            files: {
              'jquery.js': 'jquery/dist/jquery.js',
              'underscore.js': 'underscore/underscore.js',
              'moment/moment.min.js': 'moment/min/moment.min.js',
              'moment/locale/pt.js': 'moment/locale/pt.js',
              'backbone.js': 'backbone/backbone.js',
              'backbone.wreqr.js': 'backbone.wreqr/lib/backbone.wreqr.js',
              'backbone.babysitter.js': 'backbone.babysitter/lib/backbone.babysitter.js',
              'backbone.marionette.js': 'marionette/lib/backbone.marionette.js',
              'backbone-pouch.js': 'backbone-pouch/index.js',
              'pouchdb.js': 'pouchdb/dist/pouchdb.js',
              'bootstrap.js': 'bootstrap/dist/js/bootstrap.js',
              'ladda-bootstrap/spin.min.js': 'ladda-bootstrap/dist/spin.min.js',
              'ladda-bootstrap/ladda.js': 'ladda-bootstrap/dist/ladda.js',
              'bootstrap-datetimepicker.min.js': 'eonasdan-bootstrap-datetimepicker/build/js/bootstrap-datetimepicker.min.js',
              'handlebars.js': 'handlebars/handlebars.js'
            }
          },
          css: {
            options: {
              destPrefix: 'couch/app/_attachments/css'
            },
            files: {
              'bootstrap.css': 'bootstrap/dist/css/bootstrap.css',
              'bootstrap.css.map': 'bootstrap/dist/css/bootstrap.css.map',
              'ladda-themeless.min.css': 'ladda-bootstrap/dist/ladda-themeless.min.css',
              'bootstrap-datetimepicker.min.css': 'eonasdan-bootstrap-datetimepicker/build/css/bootstrap-datetimepicker.min.css'
            }
          },
          fonts: {
            options: {
              destPrefix: 'couch/app/_attachments/fonts'
            },
            files: {
              'glyphicons-halflings-regular.woff2': 'bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',
              'glyphicons-halflings-regular.woff': 'bootstrap/dist/fonts/glyphicons-halflings-regular.woff',
              'glyphicons-halflings-regular.ttf': 'bootstrap/dist/fonts/glyphicons-halflings-regular.ttf',
              'glyphicons-halflings-regular.svg': 'bootstrap/dist/fonts/glyphicons-halflings-regular.svg'
            }
          }
        }
    });

  // Requires the needed plugin
  grunt.loadNpmTasks('grunt-contrib-handlebars');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-couch');
  grunt.loadNpmTasks('grunt-bowercopy');
  grunt.registerTask('default',['couch']);
  grunt.registerTask('default',['less']);

};
