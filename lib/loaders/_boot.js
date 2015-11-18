module.exports = function (entry) {

	var React = require('react');
	var ReactDOM = require('react-dom');
	var ReactFluxible = require('fluxible-addons-react');

	window.addEventListener('load', function () {
    entry.rehydrate(window.EntryState, function (error, context) {
      if (error) {
        throw error;
      }
      window.context = context;
      var mountNode = document.getElementById('entry');

      var root = ReactFluxible.createElementWithContext(context);
      ReactDOM.render(root, mountNode, function () {
        console.log('--!--');
      });
    });
	});

};