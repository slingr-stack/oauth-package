/****************************************************
 OAuth
 ****************************************************/
exports.connectUser = function (eventName) {
    sys.logs.info('Getting access token [oauth]');
    sys.logs.info('[oauth] User id: '+JSON.stringify(config.get("id")));
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
                sys.logs.info('[oauth] userConnected callback');
                var config = callbackData.data;
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
                    sys.logs.info('Saving access token and refresh token [oauth]');
                    sys.storage.put(config.id +' - access_token', response.access_token);
                    sys.storage.put(config.id +' - refresh_token', response.refresh_token);
                    if(config.eventName) {
                        sys.events.triggerEvent(config.eventName, {configId: config.id,accessToken: response.access_token, refreshToken: response.refresh_token});
                    }
                } else {
                    sys.logs.error('Configuration id must be provided to store tokens [oauth] ',config);
                }
            },
            fail: function (originalMessage, callbackData) {
                sys.logs.error('Fail callback [oauth]')
            }
        }
    });
}

exports.refreshToken = function (eventName) {
    sys.logs.info('Getting refresh token [oauth]');
    sys.logs.info('[oauth] User id: '+JSON.stringify(config.get("id")));
    var configuration= {
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
        }
    };
    if (!!configuration.config.id) {
        var refreshTokenResponse = svc[configuration.config.http].post({
            url: configuration.config.accessTokenUrl,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: {
                client_id: configuration.config.clientId,
                client_secret: configuration.config.clientSecret,
                grant_type: "refresh_token",
                refresh_token: sys.storage.get(configuration.config.id + ' - refresh_token')
            }
        });
        sys.logs.info('Saving access token and refresh token');
        if (!!refreshTokenResponse && !!refreshTokenResponse.access_token && !!refreshTokenResponse.refresh_token) {
            sys.storage.put(configuration.config.id + ' - access_token', refreshTokenResponse.access_token);
            sys.storage.put(configuration.config.id + ' - refresh_token', refreshTokenResponse.refresh_token);
            if(configuration.config.eventName) {
                sys.events.triggerEvent(configuration.config.eventName, {configId: configuration.config.id,accessToken: refreshTokenResponse.access_token, refreshToken: refreshTokenResponse.refresh_token});
            }
        }
        else {
            sys.logs.error('Fail to refresh token [oauth] ', configuration.config.id, refreshTokenResponse);
        }
    }
    else {
        sys.logs.error('Fail to refresh token [oauth] the id is required: ', configuration.config.id);
    }
}