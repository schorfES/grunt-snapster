var
	merge = require('merge'),
	proxy = require('./utils/proxy')
;

module.exports = (function() {
	var
		defauls = {
			maxAsync: 5
		},

		Taskqueue = function(grunt, options) {
			this._options = merge({}, defauls, options);
			this._grunt = grunt;
			this._queue = [];
			this._active = 0;
		}
	;

	Taskqueue.prototype = merge(Taskqueue.prototype, {
		addSync: function(method, scope, message, args) {
			this._add(method, scope, message, args, true);
		},

		addAsync: function(method, scope, message, args) {
			this._add(method, scope, message, args, false);
		},

		_add: function(method, scope, message, args, sync) {
			if (typeof method === 'function') {
				this._queue.push({
					method: proxy(method, scope),
					message: message,
					args: args || [],
					sync: sync
				});
			}
		},

		run: function(callback, scope) {
			this._callback = proxy(callback, scope || this);
			this._continue();
		},

		_continue: function() {
			if (this._queue.length > 0) {
				var
					next = this._queue[0],
					args
				;

				// Check if next task is:
				// * synchronous and there are no current asynchronous tasks active...
				// * asynchronous and the maximum of asynchronous task is reached...
				// ...then stop this action
				if ((next.sync && this._active > 0) ||
					(!next.sync && this._active >= this._options.maxAsync)) {
					return;
				}

				next = this._queue.shift();
				args = [proxy(this._done, this)].concat(next.args);

				if (typeof next.message === 'string') {
					this._grunt.log.write(next.message);
				}

				this._active++;
				next.method.apply(this, args);

				// If next task (currently started task) is an asynchronous
				// task, try to start a next one...
				if (!next.sync) {
					this._continue();
				}

			} else if (this._active === 0 && typeof this._callback === 'function') {
				this._callback();
			}
		},

		_done: function(failed) {
			if (failed === true) {
				this._grunt.log.writeln(' ' + String.fromCharCode(0x2613).red);
			} else {
				this._grunt.log.writeln(' ' + String.fromCharCode(0x2714).green);
			}
			this._active--;
			this._continue();
		}
	});

	return Taskqueue;
})();
