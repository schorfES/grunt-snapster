/* global setTimeout */

var
	merge = require('merge'),
	proxy = require('./utils/proxy'),
	Taskqueue = require('./Taskqueue'),
	Tunnel = require('./Tunnel'),
	Browser = require('./Browser')
;

module.exports = (function() {
	var
		defaults = {

			// Credentials:
			credentials: {
				username: 'your-username',
				key: 'your-api-key'
			},

			// Queue options:
			browsers: [],
			maxAsync: 1,

			// Output options:
			output: '.grunt/snapster/<%= grunt.template.today("yyyy mmmm dS - h:MM:ss TT") %>/',
			filename: '<%= browser %><%= version %>_<%= device %>_<%= os %>-<%= osVersion %>.png',
			delay: 2000
		},

		TaskScreenshot = function(options, grunt) {
			this._options = merge({}, defaults, options);
			this._grunt = grunt;
			this._queue = new Taskqueue(grunt, {maxAsync: this._options.maxAsync});
		}
	;

	TaskScreenshot.prototype = merge(TaskScreenshot.prototype, {
		run: function(callback) {
			this._callback = callback;
			this._prepare();
		},

		_prepare: function() {
			if (typeof this._options.browsers === 'string') {
				if (this._options.browsers === 'all') {
					this._queue.addSync(this._getAllBrowsers, this, '...get available browsers');
				} else {
					this._options.browsers = this._grunt.file.readJSON(this._options.browsers);
				}
			}

			this._output = this._grunt.template.process(this._options.output);
			this._queue.run(this._start, this);
		},

		_start: function() {
			var self = this;

			// Open tunnel when required:
			if (this._options.tunnel) {
				this._queue.addSync(this._openTunnel, this, '...open tunnel');
			}

			this._options.browsers.forEach(function(capabilities) {
				self._queue.addAsync(self._takeScreenShot, self, undefined, [capabilities]);
			});

			// Close tunnel when required:
			if (this._options.tunnel) {
				this._queue.addSync(this._closeTunnel, this, '...close tunnel');
			}

			// Run queue:
			this._queue.run(this._callback);
		},

		_getAllBrowsers: function(queueCallback) {
			Browser.getAvailableBrowsers(
				this._options.credentials.username,
				this._options.credentials.key,
				proxy(function(browsers) {

					this._grunt.log.write(', ' + browsers.length.toString().cyan + ' received');

					// Store response in browsers
					this._options.browsers = browsers;
					queueCallback();
				}, this)
			);
		},

		_openTunnel: function(queueCallback) {
			this._tunnel = new Tunnel(this._options);
			this._tunnel.open(queueCallback);
		},

		_closeTunnel: function() {
			this._tunnel.close();
		},

		_takeScreenShot: function(queueCallback, capabilities) {
			var
				self = this,
				start = (new Date()).getTime(),
				data = {
					os: capabilities.os || '',
					osVersion: capabilities.os_version || '',
					browser: capabilities.browser || '',
					version: capabilities.browser_version || '',
					device: capabilities.device || 'desktop'
				},
				filename,
				browser
			;

			// Prepare output:
			filename = this._options.filename;
			filename = this._grunt.template.process(filename, {data: data});
			this._grunt.file.mkdir(this._output);

			// Start browser, take screenshot:
			try {
				browser = new Browser(this._options, capabilities);
				browser.run();
				setTimeout(function() {
					browser.screenshot(self._output + filename, function() {
						var duration = (new Date()).getTime() - start;

						// Log message:
						self._grunt.log.write(
							String.fromCharCode(0x25B6) + ' ' +
							data.browser.red + ' ' +
							data.version.magenta + ' @ ' +
							data.os.toString().yellow + ' ' + data.osVersion.toString().yellow + ', ' +
							data.device.cyan + ' ' +
							'done in ' + (Math.round(duration / 100) / 10) + 's'
						);

						browser.stop();
						queueCallback();
					});
				}, this._options.delay);
			} catch(error) {
				queueCallback(true);
			}
		}
	});

	return TaskScreenshot;
})();
