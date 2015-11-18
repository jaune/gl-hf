var React = require('react');
var ReactIntl = require('react-intl');

var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedDate = ReactIntl.FormattedDate;

var AuthorizeFormEntry = React.createClass({
  render: function() {
    var action = '/account/' + this.props.user.account_id + '/authorization/';

    return (
      <div>
        <div><span>{this.props.authorization.provider}</span> <span>{this.props.authorization.displayName}</span></div>
        <FormattedDate
            value={new Date()}
            day="numeric"
            month="long"
            year="numeric" />
        <form action={action} method="POST">
          <input type="hidden" name="authorization.uuid" value={this.props.authorization.uuid} />
          <button type="submit">
            <FormattedMessage id="account.authorize" />
          </button>
        </form>
      </div>
    );
  }
});


module.exports = AuthorizeFormEntry;