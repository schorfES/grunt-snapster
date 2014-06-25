module.exports = function(grunt) {
	grunt.config('copy', {
		browsers: {
			src: './.grunt/BROWSERS.md',
			dest: './BROWSERS.md'
		}
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
};
