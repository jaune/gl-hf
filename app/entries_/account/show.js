var React = require('react');

module.exports.createFactory = function () {
	return React.createFactory(require('../../components/account/ShowEntry.jsx'));
};

module.exports.ready = function (component, props) {
	console.log('---Ready !---');
};
