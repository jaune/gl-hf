var React = require('react');
var ReactIntl = require('react-intl');
var ReactFluxible = require('fluxible-addons-react');

var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedDate = ReactIntl.FormattedDate;

var AuthorizationStore = require('../../stores/Authorization');

var AuthorizeFormEntry = React.createClass({
  render: function() {
    if (!this.props.authorization) {
      return (<div>Oups...</div>);
    }

    return (
      <div>
        <div><span>{this.props.authorization.provider}</span> <span>{this.props.authorization.displayName}</span></div>
        <FormattedDate
            value={new Date()}
            day="numeric"
            month="long"
            year="numeric" />
        <form action="/account/" method="POST">
          <input type="hidden" name="authorization.uuid" value={this.props.uuid} />
          <button type="submit">
            <FormattedMessage id="account.create" />
          </button>
        </form>
      </div>
    );
  }
});

// decorator
AuthorizeFormEntry = ReactFluxible.connectToStores(AuthorizeFormEntry, [AuthorizationStore], function (context, props) {
  return {
    uuid: context.getStore(AuthorizationStore).getUUID(),
    authorization: context.getStore(AuthorizationStore).getAuthorization()
  };
});


module.exports = AuthorizeFormEntry;