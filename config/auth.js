// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '1331396126958709', // your App ID
        'clientSecret'  : '724d23fdbcbd55354084e34335ffeeff', // your App Secret
        'callbackURL'   : 'https://challer001.herokuapp.com/auth/facebook/callback',
        'profileFields': ['id', 'displayName', 'email']
    },

    'twitterAuth' : {
        'consumerKey'       : 'xpD82FCQTYKANCSBNfxaZ2r3C',
        'consumerSecret'    : 'NiCN0cemIhCqLlaAlJsROQPy4COBbS1EnCJSWapB9vlDKtBLax',
        'callbackURL'       : 'https://challer001.herokuapp.com/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '641407902867-lqjohc9qpf2fngi0bkb91dhh1ketr1hg.apps.googleusercontent.com',
        'clientSecret'  : 'PRobM3AZcEww_BuO3A9rPnwD',
        'callbackURL'   : 'https://challer001.herokuapp.com/auth/google/callback'
    }

};
