var Fluxible = require('fluxible');

var Application = require('../components/Application.jsx');

// create new fluxible instance
const app = new Fluxible({
    component: Application
});

// register stores
app.registerStore(require('../stores/Application'));
app.registerStore(require('../stores/Authorization'));
app.registerStore(require('../stores/Route'));
app.registerStore(require('../stores/Locale'));

module.exports = app;
