// expose our config directly to our application using module.exports
module.exports = {

    'facebookAuth' : {
        'clientID'      : '438082099889129', // your App ID
        'clientSecret'  : '568762d6abc77fda9d29d87c149abdaf', // your App Secret
        'callbackURL'   : 'http://localhost:8080/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey'       : 'your-consumer-key-here',
        'consumerSecret'    : 'your-client-secret-here',
        'callbackURL'       : 'http://localhost:8080/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID'      : '641407902867-lqjohc9qpf2fngi0bkb91dhh1ketr1hg.apps.googleusercontent.com',
        'clientSecret'  : 'PRobM3AZcEww_BuO3A9rPnwD',
        'callbackURL'   : 'http://localhost:8080/auth/google/callback'
    }

};
