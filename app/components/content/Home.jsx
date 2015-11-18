var React = require('react');
var ReactIntl = require('react-intl');

var FormattedMessage = ReactIntl.FormattedMessage;


var Home = React.createClass({
  render: function() {
    return (
      <section>
        <h2><FormattedMessage id="home.sign-in-or-sign-on" /></h2>
        <ul>
          <li><a href="/authorize/steam">Steam</a></li>
          <li><a href="/authorize/twitch">Twitch</a></li>
          <li>Battle.net</li>
          <li>Origin</li>
          <li>League of Legends</li>
          <li>Uplay</li>
        </ul>
      </section>
    );
  }
});

module.exports = Home;