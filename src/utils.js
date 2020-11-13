import base32Encode from "base32-encode"
import base64 from "base64-js"
import Url from "url-parse"

export function setCookie(values, exdays) {
	let cvalue = JSON.stringify(values)
	console.log(cvalue)
	if (exdays == 0) {
		var expires = 0
	} else {
		var d = new Date()
		d.setTime(d.getTime() + (exdays*24*60*60*1000))
		var expires = "expires="+ d.toUTCString()
	}
	document.cookie = "skyid=" + cvalue + ";" + expires + ";path=/"
}

export function delCookie() {
	document.cookie = "skyid=;0;path=/"
}

export function getCookie() {
	var name = "skyid="
	var decodedCookie = decodeURIComponent(document.cookie)
	var ca = decodedCookie.split(';')
	for (var i = 0; i <ca.length; i++) {
		var c = ca[i]
		while (c.charAt(0) == ' ') {
			c = c.substring(1)
		}
		if (c.indexOf(name) == 0) {
			let cstring = c.substring(name.length, c.length)
			try {
				return JSON.parse(cstring)
			} catch {
				delCookie()
			}
		}
	}
	return false;
}

export function toHexString(byteArray) {
	let s = "";
	byteArray.forEach(function (byte) {
		s += ("0" + (byte & 0xff).toString(16)).slice(-2);
	});
	return s;
}

export function decodeBase64(input) {
	return base64.toByteArray(
		input.padEnd(input.length + 4 - (input.length % 4), "=")
	)
}

export function encodeBase32(input) {
	return base32Encode(input, "RFC4648-HEX", { padding: false }).toLowerCase()
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

// checks if the url an insecure skylink page
// returns a string or null: safe_container, unsafe_skypage, null
export function redirectToSkappContainer(url = null) {
	if (url == null) {
		var location = window.location
	} else {
		var location = new Url(url)
	}

	const base64Regex = /^([a-zA-Z0-9-_]{46})\.*$/
	const base32Regex = /^([a-z0-9]{55})\..*$/

	let protocol = location.protocol
	let hostname = location.hostname
	let pathname = location.pathname || ''
	let hash = location.hash || ''
	let search = location.search || ''
	let domains = hostname.split('.')
	var [firstPath, remainingPath] = getFirstAndRemainingPath(pathname)



	if (base64Regex.test(firstPath)) { // unsafe_skypage
		let decoded = decodeBase64(firstPath)
		let base32skylink = encodeBase32(decoded)
		let container = protocol + "//" + base32skylink + '.' + hostname + remainingPath + hash + search
		return container
	} else if (firstPath == 'hns') { // unsafe_skypage
		var [secondPath, remainingPath] = getFirstAndRemainingPath(remainingPath)
		let container = protocol + "//" + secondPath + '.hns.' + hostname + remainingPath + hash + search
		return container
	} else if (domains.length > 3 && domains[domains.length - 3] == 'hns') { // safe_container
		return false
	} else if (base32Regex.test(location.hostname)) { // safe base32 subdomain
		return false
	} else if (protocol == 'file:' || hostname == 'skynote.local') { // for development purposes
		return false
	} else {
		return null
	}
}

export function popupCenter(url, title, w, h) {
    // Fixes dual-screen position                             Most browsers      Firefox
    const dualScreenLeft = window.screenLeft !==  undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop !==  undefined   ? window.screenTop  : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
	const newWindow = window.open(url, title, 
		`
		scrollbars=yes,
		width=${w / systemZoom}, 
		height=${h / systemZoom}, 
		top=${top}, 
		left=${left}
		`
	  )

	if (window.focus) newWindow.focus();
	return newWindow
}


// apply display settings for hide-if-logged-in and show-if-logged-in
export function toggleElementsDisplay(seed) {
	// initialize
	document.querySelectorAll('.show-if-initialized').forEach(function(element) {
		element.style.display = ''
	})
	document.querySelectorAll('.hide-if-initialized').forEach(function(element) {
		element.style.display = 'none'
	})

	
	if (seed == '') { // logged out
		document.querySelectorAll('.hide-if-logged-in').forEach(function(element) {
			element.style.display = ''
		})
		document.querySelectorAll('.show-if-logged-in').forEach(function(element) {
			element.style.display = 'none'
		})
	} else { // logged in
		document.querySelectorAll('.hide-if-logged-in').forEach(function(element) {
			element.style.display = 'none'
		})
		document.querySelectorAll('.show-if-logged-in').forEach(function(element) {
			element.style.display = ''
		})
	}
}


function getFirstAndRemainingPath(pathname) {
	var trimmedPathname = trimChar(pathname, '/')
	if (trimmedPathname.includes('/')) {
		let index = trimmedPathname.indexOf("/")  // Gets the first index where a space occours
		var firstPath = trimmedPathname.substr(0, index) // Gets the first part
		var remainingPath = "/" + trimmedPathname.substr(index + 1)  // Gets the text part
	} else {
		var firstPath = trimmedPathname
		var remainingPath = ''
	}
	return [firstPath, remainingPath]
}

export function showOverlay(opts) {
	// disableLoadingScreen
	if (opts != null && typeof opts.disableLoadingScreen != 'undefined' && opts.disableLoadingScreen == true) {
		return
	}
	
	// multiple loading animations from https://codepen.io/AlexWarnes/pen/jXYYKL - random displayed
	let loadScreens = [
		`<!-- GRADIENT SPINNER -->
		<div class="spinner-box">
			<div class="circle-border">
				<div class="circle-core"></div>
			</div>  
		</div>`,

		`<!-- SPINNER ORBITS -->
		<div class="spinner-box">
			<div class="blue-orbit leo"></div>
			<div class="green-orbit leo"></div>
			<div class="red-orbit leo"></div>
			<div class="white-orbit w1 leo"></div>
			<div class="white-orbit w2 leo"></div>
			<div class="white-orbit w3 leo"></div>
		</div>`,

		`<!-- GRADIENT CIRCLE PLANES -->
		<div class="spinner-box">
			<div class="leo-border-1">
				<div class="leo-core-1"></div>
			</div> 
			<div class="leo-border-2">
				<div class="leo-core-2"></div>
			</div> 
		</div>`,

		`<!-- SPINNING SQUARES -->
		<div class="spinner-box">
			<div class="configure-border-1">  
				<div class="configure-core"></div>
			</div>  
			<div class="configure-border-2">
				<div class="configure-core"></div>
			</div> 
		</div>`,

		`<!-- LOADING DOTS... -->
		<div class="spinner-box">
			<div class="pulse-container">  
				<div class="pulse-bubble pulse-bubble-1"></div>
				<div class="pulse-bubble pulse-bubble-2"></div>
				<div class="pulse-bubble pulse-bubble-3"></div>
			</div>
		</div>`,

		`<!-- SOLAR SYSTEM -->
		<div class="spinner-box">
			<div class="solar-system">
				<div class="earth-orbit orbit">
					<div class="planet earth"></div>
					<div class="venus-orbit orbit">
						<div class="planet venus"></div>
							<div class="mercury-orbit orbit">
								<div class="planet mercury"></div>
							<div class="sun"></div>
						</div>
					</div>
				</div>
			</div>
		</div>`,

		`<!-- Three Quarter Spinner -->
		<div class="spinner-box">
		  	<div class="three-quarter-spinner"></div>
		</div>`,
	]


	if (!document.getElementById('loadingOverlay')) {
		var loadScreen = document.createElement("div")
		loadScreen.id = 'loadingOverlay'
		loadScreen.innerHTML = loadScreens[Math.floor(Math.random() * loadScreens.length)]
		document.body.appendChild(loadScreen)
	}
}

export function hideOverlay(opts) {
	// disableLoadingScreen
	if (opts != null && typeof opts.disableLoadingScreen != 'undefined' && opts.disableLoadingScreen == true) {
		return
	}
	if (document.getElementById('loadingOverlay')) {
		document.getElementById("loadingOverlay").remove()
	}
}