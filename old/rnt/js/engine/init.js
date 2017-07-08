define({
    init: function () {
        var d = document, w = window;

        var gameScreen = d.createElement('canvas'),
	        unsupportedBrowser = d.createElement('div');

        gameScreen.id = 'gameScreen';
        gameScreen.width = 640;
        gameScreen.height = 480;

        unsupportedBrowser.innerHTML = '<p>Unfortunately it appears your browser does not support <a href="http://en.wikipedia.org/wiki/HTML5">HTML5</a>.</p><p>Please try one of the following, more standards compliant browsers: <a href="http://www.mozilla.com/firefox/">Firefox</a>, <a href="http://www.google.com/chrome">Chrome</a>, <a href="http://www.opera.com/">Opera</a> or (if you <i>really</i> must) <a href="http://www.apple.com/safari/">Safari</a>.</p>';

        d.getElementById('content').appendChild((gameScreen.getContext) ? gameScreen : unsupportedBrowser);

        var gamectx = gameScreen.getContext('2d');
    }
});