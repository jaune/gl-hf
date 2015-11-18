var React = require('react');

var ShowEntry = React.createClass({
  logoutClickHandler: function () {
    var req = new XMLHttpRequest();
    req.open('DELETE', '/session', true);
    req.onreadystatechange = function (aEvt) {
      if (req.readyState === 4) {
        if(req.status === 200) {
          console.log('logout !!!');
        } else {
          console.log('error !!!');
        }
      }
    };
    req.send(null);
  },
  render: function() {
    var account = this.props.account,
        authorizations = [];

    account.authorizations.forEach(function (authorization, index) {
      var info = 'unknown';

      switch (authorization.provider) {
        case 'stream':
          info = (<span>{authorization.steamid}</span>);
          break;
        case 'twitchtv':
          info = (<span><a href={authorization.url}>{authorization.username}</a></span>);
          break;
      }

      authorizations.push(<li key={index}><span>{authorization.provider}</span> {info}</li>);
    });

    return (
      <div>
      <header>
        <button onClick={this.logoutClickHandler}>logout</button>
      </header>
      <section>
        <h2>{this.props.displayName}</h2>
        <ul>
          {authorizations}
        </ul>
      </section>
      </div>
    );
  }
});

module.exports = ShowEntry;