/****************************************************
 OAuth
 ****************************************************/

exports.connectUser = function (eventName) {
    sys.logs.info('[oauth] Getting access token');
    var pkgConfig = config.get();
    sys.logs.debug('[oauth] Package config: '+JSON.stringify(pkgConfig));
    sys.logs.info('[oauth] User id: '+JSON.stringify(pkgConfig.id));
    sys.ui.sendMessage({
        scope: 'uiService:oauth.oAuth',
        name: 'connectUser',
        config: {
            authUrl: pkgConfig.authUrl,
            accessTokenUrl: pkgConfig.accessTokenUrl,
            clientId: pkgConfig.clientId,
            clientSecret: pkgConfig.clientSecret,
            scope: pkgConfig.scope,
            state: pkgConfig.state,
            oauthCallback: pkgConfig.oauthCallback,
            additionalQueryString: pkgConfig.additionalQueryString,
            id: pkgConfig.id,
            http: dependencies.http._name,
            eventName: eventName
        },
        callbacks: {
            userConnected: function (originalMessage, callbackData) {
                sys.logs.info('[oauth] userConnected callback');
                var config = callbackData.data;
                try {
                    var response = svc[config.http].post({
                        url: config.accessTokenUrl,
                        headers: {
                            Accept: "application/json",
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        body: {
                            client_id: config.clientId,
                            client_secret: config.clientSecret,
                            code: decodeURIComponent(config.code),
                            redirect_uri: config.oauthCallback,
                            grant_type: "authorization_code"
                        }
                    });
                    if(config.id) {
                        sys.logs.info('[oauth] Saving access token and refresh token');
                        sys.storage.put(config.id +' - access_token', response.access_token, {encrypt: true});
                        sys.storage.put(config.id +' - refresh_token', response.refresh_token, {encrypt: true});
                        if(config.eventName) {
                            sys.events.triggerEvent(config.eventName, {configId: config.id,accessToken: response.access_token, refreshToken: response.refresh_token});
                        }
                    } else {
                        sys.logs.error('[oauth] Configuration id must be provided to store tokens ',config);
                    }
                } catch (e) {
                    sys.logs.error('[oauth] Fail to get access token: '+e);
                    throw e;
                }
            },
            fail: function (originalMessage, callbackData) {
                sys.logs.error('[oauth] Fail callback with message: '+callbackData.message+' and data: '+callbackData.data);
            }
        }
    });
}

exports.refreshToken = function (eventName) {
    sys.logs.info('[oauth] Getting refresh token');
    var pkgConfig = config.get();
    sys.logs.info('[oauth] User id: '+JSON.stringify(pkgConfig.id));
    var configuration= {
        config: {
            authUrl: pkgConfig.authUrl,
            accessTokenUrl: pkgConfig.accessTokenUrl,
            clientId: pkgConfig.clientId,
            clientSecret: pkgConfig.clientSecret,
            scope: pkgConfig.scope,
            state: pkgConfig.state,
            oauthCallback: pkgConfig.oauthCallback,
            id: pkgConfig.id,
            http: dependencies.http._name,
            eventName: eventName
        }
    };
    if (!!configuration.config.id) {
        var refreshToken = sys.storage.get(configuration.config.id + ' - refresh_token', {decrypt: true})
        if (!refreshToken || refreshToken === '') {
            sys.logs.warn('[oauth] Fail to refresh access_token, there is no refresh token', configuration.config.id);
            throw new Error('Fail to refresh access_token, there is no refresh token');
        } else {
            try {
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
                        refresh_token: refreshToken
                    }
                });
                sys.logs.info('[oauth] Saving access token and refresh token');
                if (!!refreshTokenResponse && !!refreshTokenResponse.access_token && !!refreshTokenResponse.refresh_token) {
                    sys.storage.put(configuration.config.id + ' - access_token', refreshTokenResponse.access_token, {encrypt: true});
                    sys.storage.put(configuration.config.id + ' - refresh_token', refreshTokenResponse.refresh_token, {encrypt: true});
                    if (configuration.config.eventName) {
                        sys.events.triggerEvent(configuration.config.eventName, {
                            configId: configuration.config.id,
                            accessToken: refreshTokenResponse.access_token,
                            refreshToken: refreshTokenResponse.refresh_token
                        });
                    }
                } else {
                    sys.logs.error('[oauth] Fail to refresh token', configuration.config.id, refreshTokenResponse);
                }
            } catch (e) {
                sys.logs.error('[oauth] Fail to get refresh token: '+e);
                throw e;
            }
        }
    }
    else {
        sys.logs.error('[oauth] Fail to refresh token, the id is required: ', configuration.config.id);
    }
}

exports.disconnectUser = function (eventName) {
    sys.logs.info('[oauth] Disconnecting user');
    var pkgConfig = config.get();
    sys.logs.info('[oauth] User id: '+JSON.stringify(pkgConfig.id));
    var configuration= {
        config: {
            authUrl: pkgConfig.authUrl,
            accessTokenUrl: pkgConfig.accessTokenUrl,
            clientId: pkgConfig.clientId,
            clientSecret: pkgConfig.clientSecret,
            scope: pkgConfig.scope,
            state: pkgConfig.state,
            oauthCallback: pkgConfig.oauthCallback,
            id: pkgConfig.id,
            http: dependencies.http._name,
            eventName: eventName
        }
    };
    if (!!configuration.config.id) {
        sys.storage.remove(configuration.config.id + ' - access_token');
        sys.storage.remove(configuration.config.id + ' - refresh_token');
        if(configuration.config.eventName) {
            sys.events.triggerEvent(configuration.config.eventName, {configId: configuration.config.id});
        }
    }
    else {
        sys.logs.error('[oauth] Fail to remove token, the id is required: ', configuration.config.id);
    }
}

exports.testFunction = function (eventName) {
    sys.logs.info('[oauth] Getting access token');
    var pkgConfig = config.get();
    sys.logs.debug('[oauth] Package config: '+JSON.stringify(pkgConfig));
    sys.logs.info('[oauth] User id: '+JSON.stringify(pkgConfig.id));
    sys.ui.sendMessage({
        scope: 'uiService:oauth.oAuth',
        name: 'testFunction',
        config: {
            authUrl: pkgConfig.authUrl,
            accessTokenUrl: pkgConfig.accessTokenUrl,
            clientId: pkgConfig.clientId,
            clientSecret: pkgConfig.clientSecret,
            scope: pkgConfig.scope,
            state: pkgConfig.state,
            oauthCallback: pkgConfig.oauthCallback,
            additionalQueryString: pkgConfig.additionalQueryString,
            id: pkgConfig.id,
            http: dependencies.http._name,
            eventName: eventName
        },
        callbacks: {
            userConnected: function (originalMessage, callbackData) {
                sys.logs.warn('[oauth] originalMessage: '+JSON.stringify(originalMessage));
                sys.logs.warn('[oauth] callbackData: '+JSON.stringify(callbackData));
            }
        }
    });
}
