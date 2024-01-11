service.connectUser = function (message) {
    var config = message.config;
    var url = `${config.authUrl}?response_type=code&client_id=${config.clientId}&state=${config.state}&scope=${encodeURIComponent(config.scope)}&redirect_uri=${encodeURIComponent(config.oauthCallback)}`;
    var win = window.open(url, 'Authorization page', 'toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=500,height=600,left='+((screen.width/2)-250)+',top='+((screen.height/2)-250)+',');
    var intervalFn = function () {
        try {
            if (!win || !win.location) {
                window.clearInterval(pollTimer);
            } else {
                if (win.location.href.indexOf('/authCallback') != -1) {
                    win.innerWidth = 100;
                    win.innerHeight = 100;
                    win.screenX = screen.width;
                    win.screenY = screen.height;
                    window.clearInterval(pollTimer);
                    url = win.location.href;
                    var pos = url.indexOf('code=');
                    var token;
                    if (pos > -1) {
                        var endIndex = url.indexOf('&', pos);
                        if (endIndex === -1) {
                            endIndex = url.length;
                        }
                        token = url.substring(pos + 5, endIndex);
                        config.code = token;
                        var h1Element = document.createElement('h1');
                        try {
                            console.log("Connection successful [oauth]")
                            h1Element.textContent = 'Successful';
                            document.body.appendChild(h1Element);
                            service.callback(message, 'userConnected', config);
                            setTimeout(function() { }, 1000);
                            win.close();
                        } catch (e) {
                            console.error('Error on connectUser function [oauth], window not closed: '+e);
                            h1Element.textContent = 'Error';
                            document.body.appendChild(h1Element);
                            service.callback(message, 'fail', config);
                        }
                    }
                }
            }
        } catch (e) {
            console.error('Error on connectUser function [oauth], error on window: '+e);
        }
    };
    var pollTimer = window.setInterval(function() {intervalFn.apply(self);}, 2500);
}

service.testFunction = function (message) {
    var config = message.config;
    var url = `${config.authUrl}?response_type=code&client_id=${config.clientId}&state=${config.state}&scope=${encodeURIComponent(config.scope)}&redirect_uri=${encodeURIComponent(config.oauthCallback)}`;
    var win = window.open(url, 'Authorization page', 'toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=500,height=600,left='+((screen.width/2)-250)+',top='+((screen.height/2)-250)+',');
    console.log('test function arrived ',message);
    service.callback(message, 'userConnected', config);
}
