var React = require('react');
var LocaleStore = require('../stores/Locale');
var ApplicationStore = require('../stores/Application');

var Html = React.createClass({
    render: function () {
        return (
            <html lang={this.props.context.getStore(LocaleStore).getLanguage()}>
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, minimum-scale=1.0, initial-scale=1.0, user-scalable=yes" />
                <title>{this.props.context.getStore(ApplicationStore).getTitle()}</title>
            </head>
            <body>
                <div id="entry" dangerouslySetInnerHTML={{__html: this.props.entry}}></div>
                <script dangerouslySetInnerHTML={{__html: this.props.state}}></script>
                <script src={this.props.commonPath}></script>
                <script src={this.props.entryPath} async></script>
            </body>
            </html>
        );
    }
});

module.exports = Html;
