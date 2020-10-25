import base64 from "base64-js"
import base32Encode from "base32-encode"

function decodeBase64(input) {
	return base64.toByteArray(
		input.padEnd(input.length + 4 - (input.length % 4), "=")
	)
}

function encodeBase32(input) {
	return base32Encode(input, "RFC4648-HEX", { padding: false }).toLowerCase()
}

function isSubdomain() {
	let url = window.location.pathname
    let regex = new RegExp(/^([a-z]+\:\/{2})?([\w-]+\.[\w-]+\.\w+)$/)
    return !!url.match(regex) // make sure it returns boolean
}

function isSkylinkPage() {
	let trimmedPathname = trimChar(window.location.pathname, '/')
	if (trimmedPathname.includes('/')) {
		let index = trimmedPathname.indexOf("/")  // Gets the first index where a space occours
		var skylink = trimmedPathname.substr(0, index) // Gets the first part
	} else {
		var skylink = trimmedPathname.substr(0, index)
	}

	notSkylink = /[^\da-z-_]/i
	
	if (skylink.length == 46 && !notSkylink.test(skylink)) {
		return true
	} else {
		return false
	}
}

function trimChar(string, charToRemove) {
    while(string.charAt(0)==charToRemove) {
        string = string.substring(1)
    }

    while(string.charAt(string.length-1)==charToRemove) {
        string = string.substring(0,string.length-1)
    }

    return string
}

function redirectToSkappContainer(location) {
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


window.SkyID = class SkyID {
	
	constructor(sessionCallback) {
		window.addEventListener("message", (event) => {
			if (typeof event.data.sender != 'undefined' && event.data.sender == 'skyid') {
				console.log("event.data", event.data)
				let message = event.data
				sessionCallback(message)
			}
		}, false)
	}

	sessionStart() {
		// BROKEN ON https://pg0anies87je55r4ngqssqce4o3cirn9dfu38nmbvef6tudpoohlhlo.siasky.net/example_skapp.html
		if (!isSubdomain() || !isSkylinkPage()) {
			let red = redirectToSkappContainer(window.location)
			window.location.href = red
		}
		// NOT IMPLEMENTED YET
		window.windowObjectReference = window.open(
			"example_login.html",
			"DescriptiveWindowName",
			"resizable,scrollbars,status,width=400,height=500"
		)
	}

	getUserValidationLevel() {
		// NOT IMPLEMENTED YET
	}
}