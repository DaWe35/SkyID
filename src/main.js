var sia = require('sia-js')
global.Buffer = global.Buffer || require('buffer').Buffer

function toHexString(byteArray) {
	return Array.from(byteArray, function(byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2)
	}).join('')
}

function setCookie(cname, cvalue, exdays) {
	var d = new Date()
	d.setTime(d.getTime() + (exdays*24*60*60*1000))
	var expires = "expires="+ d.toUTCString()
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

function getCookie(cname) {
	var name = cname + "="
	var decodedCookie = decodeURIComponent(document.cookie)
	var ca = decodedCookie.split(';')
	for (var i = 0; i <ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) == ' ') {
			c = c.substring(1)
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length)
		}
	}
	return "";
}

function checkCookie() {
	var user = getCookie("username")
	if (user != "") {
		alert("Welcome again " + user)
	} else {
		user = prompt("Please enter your name:", "")
		if (user != "" && user != null) {
			setCookie("username", user, 365)
		}
	}
} 


function keypairCallback(random_data) {
	var nonce = Buffer.from([0,0,0,0,0,0,0,0])
	var arr = [random_data, nonce]
	
	var seed = Buffer.concat(arr)
	// show the words
	// var words = mnemonic.toMnemonic(data)
	
	// console.log(data) 
	let keypair = sia.keyPair.generateFromSeed(seed)

	let mnemonic = sia.mnemonics.bytesToMnemonic(random_data)

	document.getElementById('mnemonic').innerHTML = mnemonic
	document.getElementById('seckey').innerHTML = keypair['privateKey']
	document.getElementById('pubkey').innerHTML = keypair['publicKey']
	document.getElementById('address').innerHTML = keypair['address']
}

window.SkyidMain = class SkyidMain {
	constructor() {
		console.log('construct')
	}
		
	generateRandomKeypair() {
		sia.keyPair.generateRandomData(keypairCallback)
	}
}