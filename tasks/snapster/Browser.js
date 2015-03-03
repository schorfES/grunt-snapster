var
	fs = require('fs'),
	exec = require('child_process').exec,
	merge = require('merge'),
	webdriver = require('browserstack-webdriver')
;

module.exports = (function() {
	var
		defaults = {
			tunnel: false,
			host: 'github.com',
			port: 80,
			pathname: '/',
			ssl: false,

			credentials: {
				key: undefined,
				username: undefined
			}
		},

		Browser = function(options, capabilities) {
			this._options = merge({}, defaults, options);
			this._capabilities = capabilities;
		}
	;

	Browser.prototype = merge(Browser.prototype, {

		run: function() {
			this._driver = new webdriver.Builder()
				.usingServer('http://hub.browserstack.com/wd/hub')
				.withCapabilities(this._getCapabilities())
				.build();

			this.open();
		},

		open: function(url) {
			url = url || this._getFullUrl();
			this._driver.get(url);
		},

		stop: function() {
			this._driver.quit();
		},

		screenshot: function(filename, callback) {
			return this._driver.takeScreenshot().then(function(data) {
				fs.writeFile(filename, data.replace(/^data:image\/png;base64,/,''), 'base64', function(error) {
					if (error) {
						throw error;
					}

					if (typeof callback === 'function') {
						callback();
					}
				});
			});
		},

		_getFullUrl: function() {
			return 'http' + (this._options.ssl ? 's' : '') +
				'://' + this._options.host +
				':' + this._options.port +
				this._options.pathname;
		},

		_getCapabilities: function() {
			return merge({
					'browserstack.tunnel': this._options.tunnel.toString(),
					'browserstack.user': this._options.credentials.username,
					'browserstack.key': this._options.credentials.key
				}, this._capabilities
			);
		}
	});

	Browser.getAvailableBrowsers = function(username, key, callback) {
		exec('curl -u "' + username + ':' + key + '" https://www.browserstack.com/automate/browsers.json', function(error, stdout) {
			var response = [];

			if (!(error instanceof Error)) {
				response = JSON.parse(stdout);
			}

			if (typeof callback === 'function') {
				callback(response);
			}
		});
	};

	return Browser;
})();
