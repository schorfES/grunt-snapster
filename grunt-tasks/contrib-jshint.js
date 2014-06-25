module.exports = function(grunt) {
	grunt.config('jshint', {
		all: [
			'Gruntfile.js',
			'tasks/**/*.js'
		],
		options: {
			jshintrc: '.jshintrc'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
};
