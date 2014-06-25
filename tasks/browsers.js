var
	Browser = require('./snapster/Browser')
;

module.exports = function(grunt) {
	grunt.registerTask(
		'snapster-browsers',
		'Get list of all browsers and put them into the BROWSERS.md',
		function() {
			var
				credentials = grunt.file.readJSON('snapster.credentials'),
				async = this.async()
			;

			Browser.getAvailableBrowsers(credentials.username, credentials.key, function(browsers) {
				var
					out = '',
					os = '',
					os_version = '',
					brwsr = ''
				;

				// Sort browsers
				browsers = browsers.sort(function(brwsrA, brwsrB) {
					brwsrA = brwsrA.os + brwsrA.os_version + brwsrA.browser + brwsrA.browser_version;
					brwsrB = brwsrB.os + brwsrB.os_version + brwsrB.browser + brwsrB.browser_version;
					if (brwsrA < brwsrB) {
						return -1;
					} else if (brwsrA > brwsrB) {
						return 1;
					}
					return 0;
				});


				// Write markdown file
				browsers.forEach(function(browser) {

					if (browser.os !== os) {
						out += '\n\n## ' + browser.os.charAt(0).toUpperCase() + browser.os.slice(1);
						os = browser.os;
						os_version = '';
					}

					if (browser.os_version !== os_version) {
						out += '\n\n### ' + browser.os_version;
						os_version = browser.os_version;
						brwsr = '';
					}

					if (browser.browser !== brwsr) {
						out += '\n\n#### ' + browser.browser.charAt(0).toUpperCase() + browser.browser.slice(1);
						brwsr = browser.browser;
					}

					if (browser.browser_version) {
						out += '\n\n##### ' + browser.browser_version;
					}
					out += '\n\n```JSON';
					out += '\n' + JSON.stringify(browser, undefined, 4);
					out += '\n```';

				});

				grunt.file.write('.grunt/BROWSERS.md', '# Browsers' + out);
				async();
			});
		}
	);
};
