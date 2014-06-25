var
	merge = require('merge'),
	TaskScreenshot = require('./snapster/TaskScreenshot')
;

module.exports = function(grunt) {
	grunt.registerMultiTask(
		'snapster',
		'Take screenshots of your sites using browserstack',
		function() {
			var
				credentials
			;

			// Test for credentials:
			if (!this.data.credentials) {
				grunt.log.error('Missing credentials options.');
				return;
			}

			if (this.data.credentials.file) {
				credentials = grunt.file.readJSON(this.data.credentials.file);
				merge(this.data, {credentials: credentials});
			}

			if (!this.data.credentials.username || !this.data.credentials.key) {
				grunt.log.error('Missing credentials.');
				return;
			}

			new TaskScreenshot(this.data, grunt).run(this.async());
		}
	);
};
