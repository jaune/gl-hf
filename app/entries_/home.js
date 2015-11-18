var React = require('react');

module.exports.createFactory = function () {
	return React.createFactory(require('../components/HomeEntry.jsx'));
};

module.exports.ready = function (component, props) {
	console.log('---Ready !---');
};
