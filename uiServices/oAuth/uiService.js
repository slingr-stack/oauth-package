service.connectUser = function (message) {
    const config = message.config;
    let url = `${config.authUrl}?response_type=code&client_id=${config.clientId}&state=${config.state}&scope=${encodeURIComponent(config.scope)}&redirect_uri=${encodeURIComponent(config.oauthCallback)}&access_type=offline`;
    let win = window.open(url, 'Authorization page', 'toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=500,height=600,left='+((screen.width/2)-250)+',top='+((screen.height/2)-250)+',');
    let intervalFn = function () {
        try {
            if (!win || !win.location) {
                window.clearInterval(pollTimer);
            } else {
                if (win.location.href.indexOf('/authCallback') !== -1) {
                    win.innerWidth = 100;
                    win.innerHeight = 100;
                    win.screenX = screen.width;
                    win.screenY = screen.height;
                    win.document.body.style.backgroundImage = 'linear-gradient(to bottom, #E3F2FD, #FFFFFF)';
                    window.clearInterval(pollTimer);
                    url = win.location.href;
                    let pos = url.indexOf('code=');
                    let token;
                    if (pos > -1) {
                        let endIndex = url.indexOf('&', pos);
                        if (endIndex === -1) {
                            endIndex = url.length;
                        }
                        token = url.substring(pos + 5, endIndex);
                        config.code = token;
                        let h1Element = win.document.createElement('h1');
                        try {
                            console.log("Connection successful [oauth]")
                            h1Element.textContent = 'Connection Successful!';
                            h1Element.style.color = '#4CAF50'; // Green color
                            h1Element.style.fontFamily = 'Arial, sans-serif'; // Font
                            h1Element.style.fontSize = '36px'; // Font size
                            h1Element.style.textAlign = 'center'; // Center alignment
                            h1Element.style.marginTop = '20px'; // Top margin
                            h1Element.style.padding = '10px'; // Padding
                            h1Element.style.border = '2px solid #4CAF50'; // Green border
                            h1Element.style.borderRadius = '8px'; // Rounded corners
                            h1Element.style.backgroundColor = '#f9f9f9'; // Light background
                            win.document.body.appendChild(h1Element);
                            service.callback(message, 'userConnected', config);
                            setTimeout(function() { }, 1000);
                            win.close();
                        } catch (e) {
                            console.error('Error on connectUser function [oauth], window not closed: '+e);
                            h1Element.textContent = 'Connection Failed!';
                            h1Element.style.color = '#F44336';
                            h1Element.style.fontFamily = 'Arial, sans-serif';
                            h1Element.style.fontSize = '36px';
                            h1Element.style.textAlign = 'center';
                            h1Element.style.marginTop = '20px';
                            h1Element.style.padding = '10px';
                            h1Element.style.border = '2px solid #F44336';
                            h1Element.style.borderRadius = '8px';
                            h1Element.style.backgroundColor = '#ffebee';
                            win.document.body.appendChild(h1Element);
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
    setTimeout(function() {
        let config = message.config;
        let url = `${config.authUrl}?response_type=code&client_id=${config.clientId}&state=${config.state}&scope=${encodeURIComponent(config.scope)}&redirect_uri=${encodeURIComponent(config.oauthCallback)}&access_type=offline`;
        console.log('[oauth] Test function message: ', message);
        console.log('[oauth] Url: ', url);
        const popup = window.open(url, 'Authorization page', 'toolbar=no,scrollbars=no,location=no,statusbar=no,menubar=no,resizable=0,width=500,height=600,left='+((screen.width/2)-250)+',top='+((screen.height/2)-250)+',');
        window.addEventListener(
            "message",
            (event) => {
                console.log(event);
                return event;
            },
            false,
        );
        console.log(popup);
        service.callback(message, 'userConnected', config);
    }, 5000);
}
