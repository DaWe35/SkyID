# SkyID

Global frontend-only verification system for web3 dapps

#### Demo: https://skydev.hns.siasky.net/

## Documentation

#### Install
``` html
<script src="https://skyaccounts.hns.siasky.net/skyid.js"></script>
```

#### Initialize
``` javascript
var skyid = new SkyID('App name')
```

#### Initialize with callback (optional)
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

#### Save file

SkyID uses SkyDB under the hood to save, modify, and fetch files. The only difference is that you don't need to remember for your secret key - SkyID generates deterministic keypairs instead.


``` javascript
let yourObject = { key1: 'value1' }
let jsonData = JSON.stringify(yourObject)
skyid.setRegistry('filename', jsonData, function(response) {
	if (response != true) {
		alert('Sorry, but upload failed :(')
	}
})
```
You can store any JSON data, for example notes, settings, or a list of your uploaded files.


#### Fetch file
``` javascript
skyid.getRegistry('filename', function(response) {
	if (response == false) {
		alert('Sorry, but note fetching failed :(')
	}
	var responseObject = JSON.parse(response)
	console.log(responseObject)
})
```

___


### Todo

___

RFC: https://forum.sia.tech/t/discussion-about-sky-id/64

### Used libraries:
[Skynet-js](https://github.com/NebulousLabs/skynet-js)
[Sia-js](https://github.com/escada-finance/sia-js)

##### Brainstorm participants & helpers:
Taek, wkibbler, redsolver, Nemo, pjbrone, kreelud, Mortal-Killer, RLZL
