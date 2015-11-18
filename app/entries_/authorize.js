var React = require('react');

module.exports.createFactory = function () {
	return React.createFactory(require('../components/UserRegisterEntry.jsx'));
};

module.exports.ready = function (component, props) {
	console.log('---Ready !---');
};
