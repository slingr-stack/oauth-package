/****************************************************
 OAuth
 ****************************************************/
exports.connectUser = function (eventName) {
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
            id: config.get("id"),
            http: dependencies.http._name,
            eventName: eventName
        },
        callbacks: {
            userConnected: function (originalMessage, callbackData) {
                sys.logs.info('userConnected callback');
                var config = callbackData;
                var response = svc[config.http].post({
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
                    sys.logs.info('Saving access token and refresh token');
                    sys.storage.put(config.id +' - access_token', response.access_token);
                    sys.storage.put(config.id +' - refresh_token', response.refresh_token);
                    if(config.eventName) {
                        sys.events.triggerEvent(config.eventName, {configId: config.id,accessToken: response.access_token, refreshToken: response.refresh_token});
                    }
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

exports.refreshToken = function () {
    sys.logs.info('Getting refresh token');
    sys.logs.info(JSON.stringify(config.get("id")));
    refreshTokenResponse = dependencies.http.post({
        url: config.get("accessTokenUrl"),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
            client_id: config.get("clientId"),
            client_secret: config.get("clientSecret"),
            grant_type: "refresh_token",
            refresh_token: sys.storage.get(config.get("id") +' - refresh_token')
        }
    });
    sys.logs.info('Saving access token and refresh token');
    sys.storage.put(config.get("id") +' - access_token', refreshTokenResponse.access_token);
    sys.storage.put(config.get("id") +' - refresh_token', refreshTokenResponse.refresh_token);
}