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
        }
    });

    // Requires the needed plugin
    grunt.loadNpmTasks('grunt-contrib-handlebars');
    grunt.loadNpmTasks('grunt-contrib-watch');

//    grunt.registerTask('watch', function (target) {
//
//        grunt.task.run([
//            'watch'
//        ]);
//    });
};