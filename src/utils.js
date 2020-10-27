import base64 from "base64-js"
import base32Encode from "base32-encode"
import Url from "url-parse"

export function setCookie(cname, cvalue, exdays) {
	var d = new Date()
	d.setTime(d.getTime() + (exdays*24*60*60*1000))
	var expires = "expires="+ d.toUTCString()
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"
}

export function getCookie(cname) {
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

export function checkCookie() {
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


export function toHexString(byteArray) {
	return Array.from(byteArray, function(byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2)
	}).join('')
}



export function decodeBase64(input) {
	return base64.toByteArray(
		input.padEnd(input.length + 4 - (input.length % 4), "=")
	)
}

export function encodeBase32(input) {
	return base32Encode(input, "RFC4648-HEX", { padding: false }).toLowerCase()
}

// checks if the url an insecure skylink page
export function isSkylinkPage(url = null) {
	if (url == null) {
		var location = window.location
	} else {
		var location = new Url(url)
	}
	let trimmedPathname = trimChar(location.pathname, '/')
	if (trimmedPathname.includes('/')) {
		let index = trimmedPathname.indexOf("/")  // Gets the first index where a space occours
		var skylink = trimmedPathname.substr(0, index) // Gets the first part
	} else {
		var skylink = trimmedPathname
	}

	let notSkylink = /[^\da-z-_]/i
	
	if (skylink.length == 46 && !notSkylink.test(skylink)) {
		return true
	} else {
		return false
	}
}

export function trimChar(string, charToRemove) {
    while(string.charAt(0)==charToRemove) {
        string = string.substring(1)
    }

    while(string.charAt(string.length-1)==charToRemove) {
        string = string.substring(0,string.length-1)
    }

    return string
}

export function redirectToSkappContainer(location) {
	let protocol = location.protocol
	let hostname = location.hostname
	let pathname = location.pathname
	let hash = location.hash
	let search = location.search
	let trimmedPathname = trimChar(pathname, '/')
	if (trimmedPathname.includes('/')) {
		let index = trimmedPathname.indexOf("/")  // Gets the first index where a space occours
		var skylink = trimmedPathname.substr(0, index) // Gets the first part
		var filename = "/" + trimmedPathname.substr(index + 1)  // Gets the text part
	} else {
		var skylink = trimmedPathname
		var filename = ''
	}

	
	let decoded = decodeBase64(skylink)
	let encoded = encodeBase32(decoded)
	let base32skylink = encoded
	let container = protocol + "//" + base32skylink + '.' + hostname + filename + hash + search
	return container
}