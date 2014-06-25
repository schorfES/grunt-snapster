module.exports = function(grunt) {
	grunt.config('jscs', {
		all: [
			'Gruntfile.js',
			'tasks/**/*.js'
		]
	});

	grunt.loadNpmTasks('grunt-jscs-checker');
};
