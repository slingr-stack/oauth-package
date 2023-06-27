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
                sys.logs.info('userConnected callback');
                var config = callbackData;
                var response = svc.http.post({
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
                    sys.storage.put(config.id +' - access_token', response.access_token);
                    sys.storage.put(config.id +' - refresh_token', response.refresh_token);
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

exports.refreshToken = function (config) {
    refreshTokenResponse = svc.http.post({
        url: config.accessTokenUrl,
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
            client_id: config.get("clientId"),
            client_secret: config.get("clientSecret"),
            grant_type: "refresh_token",
            refresh_token: sys.storage.get(config.id +' - refresh_token')
        }
    });
    if(config.id) {
        sys.storage.put(config.id +' - access_token', refreshTokenResponse.access_token);
        sys.storage.put(config.id +' - refresh_token', refreshTokenResponse.refresh_token);
    } else {
        sys.logs.error('Configuration ID must be provided to store tokens ',config);
    }
}

exports.testFunction = function (config) {
    sys.ui.sendMessage({
        scope: 'uiService:oauth.oAuth',
        name: 'testFunction',
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
                sys.logs.error('userConnected callback (test)');
                sys.logs.error('original message: '+JSON.stringify(originalMessage));
                sys.logs.error('callbackData: '+JSON.stringify(callbackData));
                sys.storage.put('test' +' - access_token', 'test token');
                sys.storage.put('test' +' - refresh_token', 'test refresh');
            }
        }
    });
}