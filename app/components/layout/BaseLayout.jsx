var React = require('react');
var ReactIntl = require('react-intl');

var FormattedMessage = ReactIntl.FormattedMessage;
var FormattedDate = ReactIntl.FormattedDate;

var BaseLayout = React.createClass({
  render: function() {
    var userBlock;

    if (this.props.user.account_id) {
      userBlock = (<div>Hello {this.props.user.displayName}</div>);
    } else {
      userBlock = (<div><a href="/authorize/"></a></div>);
    }

    var action = '/account/' + this.props.user.account_id + '/authorization/';

    return (
      <div>
        {userBlock}
        <div>{main}</div>
      </div>
    );
  }
});


module.exports = BaseLayout;