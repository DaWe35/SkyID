# SkyID

Global frontend-only verification system for web3 dapps.

#### SkyID: https://sky-id.hns.siasky.net/

#### Demo dapp using SkyID login: https://sky-note.hns.siasky.net/

Read security logs in [CHANGELOG.md](https://github.com/DaWe35/SkyID/blob/main/CHANGELOG.md)

## Getting started

### Install

``` html
<script src="/hns/sky-id/skyid.js"></script>
```

### Initialize
``` javascript
var skyid = new SkyID('App name')
```

### Initialize with options and callback (optional)
``` javascript
// detect if app is opened on localhost for development
if (window.location.hostname == 'idtest.local' || window.location.hostname == 'localhost' || window.location.protocol == 'file:') {
	var devMode = true
} else {
	var devMode = false
}

var opts = { 'devMode': devMode  }
var skyid = new SkyID('App name', skyidEventCallback, opts)

function skyidEventCallback(message) {
	switch (message) {
		case 'login_fail':
			console.log('Login failed')
			break;
		case 'login_success':
			console.log('Login succeed!')
			fetchNote()
			break;
		case 'destroy':
			console.log('Logout succeed!')
			break;
		default:
			console.log(message)
			break;
	}
}
```

#### Available options:
| Option               | default |
|----------------------|---------|
| devMode              | false   |
| disableLoadingScreen | false   |
| customSkyidUrl       | null    |

### Start session (login)

``` javascript
skyid.sessionStart()
```

### Destroy session (logout)

``` javascript
skyid.sessionDestroy()
```

### Display classes

If you wnat, you can use special HTML classes, so you don't need to listen for SkyID callbacks.

- `show-if-logged-in` - Set `display` to `''` if user logged in

- `hide-if-logged-in` - Set `display` to `nonde` if user logged in

- `show-if-initialized` - Set `display` to `''` if SkyID initialized

- `hide-if-initialized` - Set `display` to `nonde` if SkyID initialized

Example:

```
<div class="show-if-logged-in"> You are logged in! </div>
```

You can also **combine** these classes:

``` html
<div class="hide-if-initialized">Loading...</div>

<div class="show-if-initialized hide-if-logged-in" style="display:none"> Loaded and you are not logged in :( </div>

<div class="show-if-initialized show-if-logged-in" style="display:none"> Loaded and you are logged in! </div>
```
*It is important to use `style="display:none"` and not a CSS class the display property (bad example `class="display-none"`) because SkyID will only reset the display attribute and not the CSS class*


## Documentation

### Save JSON

SkyID uses SkyDB under the hood to save, modify, and fetch files. The only difference is that you don't need to remember for your secret key - SkyID generates deterministic keypairs instead.


``` javascript
let yourObject = { key1: 'value1' }
let jsonData = JSON.stringify(yourObject)
skyid.setJSON('filename', jsonData, function(response) {
	if (response != true) {
		alert('Sorry, skyid.setFile failed :(')
	}
})
```
You can store any JSON data, for example notes, settings, or a list of your uploaded files.


### Get JSON
``` javascript
skyid.getJSON('filename', function(response) {
	if (response == false) {
		alert('Sorry, skyid.getFile failed :(')
	}
	var responseObject = JSON.parse(response)
	console.log(responseObject)
})
```

### Set registry entry
``` javascript
skyid.setRegistry('filename', 'IADUs8d9CQjUO34LmdaaNPK_STuZo24rpKVfYW3wPPM2uQ', function(success) {
	if (success == false) {
		alert('Sorry, skyid.setRegistry failed :(')
	}
})
```

### Get registry entry
``` javascript
skyid.getRegistry('filename', function(entry) {
	if (entry == false) {
		alert('Sorry, skyid.getRegistry failed :(')
	}
	console.log(entry)
})
```

### Get registry URL
``` javascript
skydbFile = skyid.getRegistryUrl('filename')
```

### Upload directory
``` html
<input id="my_input" type="file" multiple="" webkitdirectory="true">
```
``` javascript
let files = document.getElementById['my_input'].files
skyid.uploadDirectory(files, function(skylink) {
	console.log('File uploaded:', skylink)
})
```

### Upload encrypted file
``` javascript
let file = document.getElementById['my_input'].files[0]
skyid.uploadEncryptedFile(file, 'derivationPath', function(skylink) {
	console.log('Uploaded:', skylink)
})
```

*derivationPath can be any string. It will be hashed with the user's app-seed, no need to make it long since the app-seed is not public. It is recommended to use unique derivationPath to each file, so users can share decription keys for one file without revealing the other files*

### Download encrypted file
``` javascript
let skylink = 'sia:/...'
skyid.downloadEncryptedFile(skylink, 'derivationPath', function(blobUrl){
	console.log('File downloaded', blobUrl)
})
```
___

RFC: https://forum.sia.tech/t/discussion-about-sky-id/64

## Used libraries:
[Skynet-js](https://github.com/NebulousLabs/skynet-js)
[Sia-js](https://github.com/escada-finance/sia-js)

## Contributors:

@Delivator

❤ Thank you! ❤

#### Brainstorm participants & helpers:
Taek, wkibbler, redsolver, Nemo, pjbrone, kreelud, Mortal-Killer, RLZL

## Development

#### Install development dependencies

`cd SkyID`

`npm install`

#### Compiling Javascript
You need to compile your node-js files (from the `src` folder) to a web-browser friendly javascript. Type

`npx webpack`

You'll see 3 new .js file in the `dist` folder. If you want to edit javascript, you can make changes inside the `src` folder and run `npx webpack` again. (Of course you can use `npx webpack --watch` so it will watch and compile automatically if you change something.

#### Open in browser
You can just open the `/dist/index.html` in your browser.

If you're using the `file://` protocol (or `idtest.local` as localhost domain), SkyID will recognise you're in development mode and siasky.net will be used as default Skynet portal.

*Chrome won't savecookies with file:// protocol. YOu can use Firefox, use idtest.local as localhost domain, or upload the dist folder to Skynet.*

#### Testing with example dapp

We have a [SkyID-example-note-dapp](https://github.com/DaWe35/SkyID-example-note-dapp), so you can clone it. Don't forget to change the source of `skyid.js` if you want to test with self-hosted SkyID ([open image](https://raw.githubusercontent.com/DaWe35/SkyID/main/assets/skyid-example.png))

To be able to test cross-domain things, you need to setup two local virtual-host domains. If you have [Wamp.NET](https://wamp.net/) installed (what I really recommend), this will be easy. You just need to create two sites pointing to your local SkyID projects: `idtest.local` for SkyID and `skynote.local` for the example dapp ([open image](https://raw.githubusercontent.com/DaWe35/SkyID/main/assets/skyid_wamp.jpg)).



