module.exports = function(grunt) {

    /*
     * https://github.com/gruntjs/grunt/wiki/Configuring-tasks
     */
    grunt.initConfig({
        dirs: {
            handlebars: '_attachments/templates'
        },
        watch: {
            handlebars: {
                files: ['<%= handlebars.compile.src %>'],
                tasks: ['handlebars:compile']
            },
            less: {
                files: ['_attachments/bower_components/bootstrap/less/*.less'],
                tasks: ['less']
            },
            coffee: {
              files: ['_attachments/**/*.coffee','lists/**/*.coffee','views/**/*.coffee'],
              tasks: ['coffee', 'couch']
            },
            configFiles: {
              files: [ 'Gruntfile.js']
            }
        },
        handlebars: {
            compile: {
                options: {
                    amd: false
                },
                src: ["_attachments/templates/**/*.handlebars"],
                dest: "_attachments/templates/precompiled.handlebars.js"
            }
        },
        less: {
            development: {
                options: {
                    paths: ["_attachments/bower_components/bootstrap/less", "_attachments/bower_components/bootstrap/dist/css"],
                    cleancss: true,
                    yuicompress: true,
                    compress: true,
                    sourceMap: true,
                    sourceMapFilename: "_attachments/bower_components/bootstrap/dist/css/bootstrap.css.map",
                    sourceMapBasepath: "_attachments/bower_components/bootstrap/dist/css/"
                },
                files: {
                    "_attachments/bower_components/bootstrap/dist/css/bootstrap.css": "_attachments/bower_components/bootstrap/less/bootstrap.less"
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
          cwd: "_attachments",
          src: ["**/*.coffee"],
          dest: '_attachments',
          ext: ".js"
        }
      },
      'couch-compile': {
        app: {
          files: {
            'tmp/couch.json': ['*',  '!.coffee', '!_attachments/js/KiwiUtils.coffee']
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
            'http://localhost:5984/coconut': 'tmp/couch.json'
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
  grunt.registerTask('default',['couch']);
  grunt.registerTask('default',['less']);

};
