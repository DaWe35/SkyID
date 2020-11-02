# SkyID

Global frontend-only verification system for web3 dapps

### SkyID: https://skyaccounts.hns.siasky.net/

### Demo dapp using SkyID login: https://skydev.hns.siasky.net/

## Documentation

### Install
``` html
<script src="https://skyaccounts.hns.siasky.net/skyid.js"></script>
```

### Initialize
``` javascript
var skyid = new SkyID('App name')
```

### Initialize with callback (optional)
``` javascript
var skyid = new SkyID('App name', skyidEventCallback)

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

### Save file

SkyID uses SkyDB under the hood to save, modify, and fetch files. The only difference is that you don't need to remember for your secret key - SkyID generates deterministic keypairs instead.


``` javascript
let yourObject = { key1: 'value1' }
let jsonData = JSON.stringify(yourObject)
skyid.setFile('filename', jsonData, function(response) {
	if (response != true) {
		alert('Sorry, but upload failed :(')
	}
})
```
You can store any JSON data, for example notes, settings, or a list of your uploaded files.


### Fetch file
``` javascript
skyid.getFile('filename', function(response) {
	if (response == false) {
		alert('Sorry, but note fetching failed :(')
	}
	var responseObject = JSON.parse(response)
	console.log(responseObject)
})
```

___


### Todo

- Connect page: check if user logged in to SkyID

- Verify app-domain and warn users if app1 wants to access app2 data

- Finish app-key generation

- Child key derivation

- File encryption & decryption

___

RFC: https://forum.sia.tech/t/discussion-about-sky-id/64

### Used libraries:
[Skynet-js](https://github.com/NebulousLabs/skynet-js)
[Sia-js](https://github.com/escada-finance/sia-js)

##### Brainstorm participants & helpers:
Taek, wkibbler, redsolver, Nemo, pjbrone, kreelud, Mortal-Killer, RLZL
