/****************************************************
 OAuth
 ****************************************************/
exports.connectUser = function () {
    sys.ui.sendMessage({
        scope: 'uiService:oauth.oAuth',
        name: 'connectUser',
        config: {
            authUrl: config.get("authUrl"),
            accessTokenUrl: config.get("accessTokenUrl"),
            clientId: config.get("clientId"),
            clientSecret: config.get("clientSecret"),
            scope: config.get("scope"),
            state: config.get("state"),
            oauthCallback: config.get("oauthCallback"),
            id: config.get("id")
        },
        callbacks: {
            userConnected: function (originalMessage, callbackData) {
                var config = callbackData;
                sys.logs.error('Code: ' + JSON.stringify(config.code));
                var res = svc.http.post({
                    url: config.accessTokenUrl,
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    body: {
                        client_id: config.clientId,
                        client_secret: config.clientSecret,
                        code: config.code,
                        redirect_uri: config.oauthCallback,
                        grant_type: "authorization_code"
                    }
                });
                if(config.id) {
                    sys.storage.put(config.id +' - access_token', res.access_token);
                    sys.storage.put(config.id +' - refresh_token', res.refresh_token);
                } else {
                    sys.logs.error('Configuration ID must be provided to store tokens ',config);
                }
            },
            fail: function (originalMessage, callbackData) {
                sys.logs.error('Fail callback')
            }
        }
    });
}