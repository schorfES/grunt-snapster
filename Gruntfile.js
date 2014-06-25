module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
	});

	grunt.loadTasks('grunt-tasks');

	grunt.registerTask(
		'default',
		'Run all tasks in a row.',
		['validate', 'test', 'build']
	);

	grunt.registerTask(
		'validate',
		'Validate all files.',
		['jshint', 'jscs', 'lintspaces']
	);

	grunt.registerTask(
		'test',
		'Run JS tests.',
		[]
	);

	grunt.registerTask(
		'build',
		'Build all JS files for a deploy.',
		['snapster-browsers', 'copy:browsers']
	);
};
