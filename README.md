
# Overview

This package allows you to connect your SLINGR application to an OAuth provider.
Commonly used as a dependency for other packages.

# Javascript API

The Javascript API of the OAuth package has:

## Shortcuts

You can make use of the helpers provided in the package:
<details>
    <summary>Click here to see all the helpers</summary>

<br>

* Connect User Method
```javascript
pkg.oauth.functions.connectUser();
```
Allows you to connect a user to the application using the OAuth protocol with the provided credentials. 
Getting the access token and refresh token and storing them in the storage of the SLINGR application.
---
* Refresh Token Method
```javascript
pkg.oauth.functions.refreshToken();
```
Allows you to refresh (and update)
the access token of a user using the refresh token stored in the storage of the SLINGR application.
---
* Disconnect User Method
```javascript
pkg.oauth.functions.disconnectUser();
```
Allows you to disconnect a user from the application
by removing the access token and refresh token from the storage of the SLINGR application.
---

</details>

## UI Service

The OAuth package user a UI service to handle the OAuth flow from the client side.
<details>
    <summary>Click here to see the UI Service</summary>

<br>

### OAuth UI Service

The OAuth UI Service allows you to catch the code returned by the OAuth provider
and exchange it for an access token and a refresh token.

<h3>Message</h3>

It contains the following properties:
* scope: The scope of the OAuth connection, which is set to `uiService:oauth.oAuth`.
* name: The name of the connection, which is `connectUser`.
* config: An object containing configuration data for the connection. Obtained from the `config` and `dependencies` variables.
* callbacks: An object containing two callback functions: `userConnected` and `fail`. These functions are called when the user is successfully connected or when the connection fails, respectively.

</details>

## Dependencies
* HTTP Service

# About SLINGR

SLINGR is a low-code rapid application development platform that accelerates development, with robust architecture for integrations and executing custom workflows and automation.

[More info about SLINGR](https://slingr.io)

# License

This package is licensed under the Apache License 2.0. See the `LICENSE` file for more details.
