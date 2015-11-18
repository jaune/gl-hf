var React = require('react');
var ReactIntl = require('react-intl');
var ReactFluxible = require('fluxible-addons-react');

var IntlProvider = ReactIntl.IntlProvider;
var FormattedMessage = ReactIntl.FormattedMessage;

var ApplicationStore = require('../stores/Application');
var LocaleStore = require('../stores/Locale');
var RouteStore = require('../stores/Route');

var setLocale = require('../actions/setLocale');

var Application = React.createClass({
  contextTypes: {
    executeAction: React.PropTypes.func.isRequired,
    getStore: React.PropTypes.func.isRequired
  },
  _onChangeLocale: function (language, region) {
    console.log('---!!---', this);
    this.context.executeAction(setLocale, {
      region: region,
      language: language
    });
  },
  render: function() {
    var content;
    
    if (this.props.contentElement) {
      content = React.createElement(this.props.contentElement);
    }    

    return (
      <IntlProvider locale={this.props.locale} messages={this.props.messages}>
        <div>
          <header>
            <FormattedMessage id="hello-name"
              values={{
                name: "World"
              }} />
            <button onClick={this._onChangeLocale.bind(this, 'fr', 'FR')}>fr-FR</button>
            <button onClick={this._onChangeLocale.bind(this, 'en', 'US')}>en-US</button>
            </header>
          {content}
        </div>
      </IntlProvider>
    );
  }
});

// decorator
Application = ReactFluxible.connectToStores(Application, [ApplicationStore, LocaleStore, RouteStore], function (context, props) {
  var appStore = context.getStore(ApplicationStore),
      localeStore = context.getStore(LocaleStore),
      routeStore = context.getStore(RouteStore);
  
  return {
      locale: localeStore.getLocale(),
      messages: localeStore.getMessages(),
      contentElement: routeStore.getCurrentRouteComponent()
  };
});

// decorator
Application = ReactFluxible.provideContext(Application);

module.exports = Application;