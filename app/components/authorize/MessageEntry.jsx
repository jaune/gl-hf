var React = require('react');
var ReactIntl = require('react-intl');

var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedDate = ReactIntl.FormattedDate;

var MessageEntry = React.createClass({
  render: function() {
    var messageID = 'account.message.' + this.props.messageKey;

    return (
      <div>
        <FormattedMessage id={messageID}
          values={{
            providerLabel: this.props.authorization.provider
          }} />
      </div>
    );
  }
});


module.exports = MessageEntry;