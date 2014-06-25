var
	spawn = require('child_process').spawn,
	merge = require('merge')
;

module.exports = (function() {
	var
		defaults = {
			key: undefined,
			host: 'github.com',
			port: 80,
			ssl: false,

			credentials: {
				key: 'your-api-key'
			}
		},

		Tunnel = function(options) {
			this._options = merge({}, defaults, options);
		}
	;

	Tunnel.prototype = merge(Tunnel.prototype, {
		open: function(callback) {
			if (typeof this._options.key === 'string') {
				var
					self = this,
					args = [
						this._options.credentials.key,
						this._options.host + ',' +
						this._options.port + ',' +
						(this._options.ssl ? '1' : 0)
					]
				;

				this._onOpen = callback;
				this._process = spawn(__dirname + '/bin/BrowserStackLocal', args);
				this._process.stdout.on('data', function(data) { self._onStdOut(data); });
			} else {
				throw new Error('Provide a browserstack apikey.');
			}
		},

		close: function() {
			if (this._process) {
				this._process.kill();
			}
		},

		_onStdOut: function(data) {
			// Detect if tunnel is established:
			// ToDo: There must be a better way!
			var
				out = data + '',
				established = out.indexOf(this._options.host + ':' + this._options.port) > -1
			;

			if (established && typeof this._onOpen === 'function') {
				var response = merge({}, this._options, {success: true});
				this._onOpen(response);
			}
		}
	});

	return Tunnel;
})();
