module.exports = function (method, context) {
	return function() {
		if (typeof method === 'function') {
			method.apply(context, arguments);
		}
	};
};
