module.exports = function(grunt) {
	grunt.config('lintspaces', {
		all: {
			src: [
				'Gruntfile.js',
				'tasks/**/*.js'
			],
			options: {
				editorconfig: '.editorconfig'
			}
		}
	});

	grunt.loadNpmTasks('grunt-lintspaces');
};
