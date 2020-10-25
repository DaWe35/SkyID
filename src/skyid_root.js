var sia = require('sia-js')
global.Buffer = global.Buffer || require('buffer').Buffer



function toHexString(byteArray) {
	return Array.from(byteArray, function(byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2)
	}).join('')
}


sia.keyPair.generateRandomData(randomCallback)

function randomCallback(random_data) {
	console.log('random data:', random_data)

	var nonce = Buffer.from([0,0,0,0,0,0,0,0])
	var arr = [random_data, nonce]
	
	var seed = Buffer.concat(arr)
	console.log('seed:', seed)
	// show the words
	// var words = mnemonic.toMnemonic(data)
	
	// console.log(data) 
	let address = sia.keyPair.generateFromSeed(seed)
	console.log(address)
}



window.SkyIDRoot = class SkyIDRoot {

	constructor() {
		const urlParams = new URLSearchParams(window.location.search)
		const appId = urlParams.get('appid')
		let appid_print_elems = document.getElementsByClassName('appid')
		for (let index = 0; index < appid_print_elems.length; index++) {
			appid_print_elems[index].innerHTML = appId
		}
		
		// Check is document.referrer the same as the register page was

	}

	CloseMySelf(data) {
		window.opener.postMessage({'sender': 'skyid', 'type': 'login', 'data': data}, "*")
		window.close()
		return false
	}
}