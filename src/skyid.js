import { getCookie, setCookie, delCookie, redirectToSkappContainer, popupCenter,
	toggleElementsDisplay, showOverlay, hideOverlay, toHexString, isOptionSet, isOptionTrue } from "./utils"
import { SkynetClient, genKeyPairFromSeed, deriveChildSeed, getRelativeFilePath, getRootDirectory } from "skynet-js";
import { pki } from "node-forge";
const sia = require('sia-js')
global.Buffer = global.Buffer || require('buffer').Buffer


window.SkyID = class SkyID {
	constructor(appId, callback = null, opts = null) {
		this.callback = callback
		this.appId = appId
		this.opts = opts

		// delete
		
		if (isOptionTrue('devMode', this.opts)) {
			console.log('devMode on, using https://siasky.net')
			this.skynetClient = new SkynetClient('https://siasky.net')
			let html = `<div id="deprecated_warn" style="position: fixed; top: 0; transform: translateX(-50%); left: 50%; background-color: #B71C1C; padding: 5px 20px; opacity: 0.5; z-index: 99999; color: white; font-size: 80%;">
					<span style="float:right; padding-left: 10px; cursor: pointer;" onclick="document.getElementById('deprecated_warn').style.display = 'none'">x</span>
					DevMode is on - 
					<a href="https://github.com/DaWe35/SkyID/blob/main/README.md#development" target="_blank" style="color: lightblue;">More info</a>
				</div>`
			var div = document.createElement("div")
			div.innerHTML = html
			document.body.appendChild(div.firstChild)
		} else {
			console.log('devMode off, using auto portal')
			this.skynetClient = new SkynetClient()
		}
		let cookie = getCookie()
		this.setAccount(cookie)
		
		window.addEventListener("message", (event) => {
			if (typeof event.data.sender != 'undefined' && event.data.sender == 'skyid') {
				if (event.data.eventCode == 'login_success') {
					setCookie(event.data.appData, 1)
					this.setAccount(event.data.appData)
				}
				typeof this.callback === 'function' && this.callback(event.data.eventCode)
			}
		}, false)

		// Load "loading" css
		var head = document.getElementsByTagName('HEAD')[0]
        var link = document.createElement('link')
        link.rel = 'stylesheet'
		link.type = 'text/css'
		if (isOptionSet('customSkyidUrl', this.opts)) {
			link.href = this.opts.customSkyidUrl + '/assets/css/loading.css'
			console.log('CSS url set to', this.opts.customSkyidUrl)
		} else if (isOptionTrue('devMode', this.opts)) {
			link.href = 'https://sky-id.hns.siasky.net/assets/css/loading.css'
			console.log('CSS url set to sky-id.hns.siasky.net')
		} else {
			link.href = '/hns/sky-id/assets/css/loading.css'
			console.log('CSS url set to /hns/sky-id/')
		}
        
        head.appendChild(link)
	}

	sessionStart() {
		let redirect = redirectToSkappContainer(window.location)
		let devMode = isOptionTrue('devMode', this.opts)
		if (redirect == null && !devMode) {
			alert('Error: unable to detect dapp container URL')
		} else {
			if (redirect != false && !devMode) {
				window.location.href = redirect
			}

			if (devMode) {
				var devModeString = '&devMode=true'
			} else {
				var devModeString = ''
			}
			if (isOptionSet('customSkyidUrl', this.opts)) {
				console.log('Connect url set to', this.opts.customSkyidUrl)
				window.windowObjectReference = popupCenter(
					this.opts.customSkyidUrl + '/connect.html?appId=' + this.appId + devModeString,
					'SkyID',
					400, 500
				)
			} else {
				console.log('Connect url set to sky-id.hns.siasky.net')
				window.windowObjectReference = popupCenter(
					'https://sky-id.hns.siasky.net/connect.html?appId=' + this.appId + devModeString,
					'SkyID',
					400, 500
				)
			}
		}
	}


	sessionDestroy(redirectUrl = null) {
		delCookie()
		this.setAccount(false)
		if (redirectUrl !== null) {
			window.location.href = redirectUrl
		}
		typeof this.callback === 'function' && this.callback('destroy')
	}



	deriveChildSeed(derivatePath) {
		return deriveChildSeed(this.seed, String(derivatePath))
	}

	// alias for compatibility
	async getFile(dataKey, callback) {
		this.getJSON(dataKey, callback)
	}
	async setFile(dataKey, json, callback) {
		this.setJSON(dataKey, json, callback)
	}

	async getJSON(dataKey, callback) {
		showOverlay(this.opts)
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		try {
			var { data, revision } = await this.skynetClient.db.getJSON(publicKey, dataKey)
		} catch (error) {
			var data = ''
			var revision = 0
		}
		hideOverlay(this.opts)
		callback(data, revision)
	}

	async setJSON(dataKey, json, callback) {
		showOverlay(this.opts)
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		try {
			await this.skynetClient.db.setJSON(privateKey, dataKey, json)
			var success = true
		} catch (error) {
			console.log(error)
			alert('Failed to save file, please retry.')
			var success = false
		}
		hideOverlay(this.opts)
		callback(success)
	}

	async getRegistry(dataKey, callback) { // needs DaWe's fork of skynet-js-2.4.0
		showOverlay(this.opts)
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		try {
			var entry = await this.skynetClient.registry.getEntry(publicKey, dataKey)
		} catch (error) {
			var entry = false
		}
		hideOverlay(this.opts)
		callback(entry)
	}

	async setRegistry(dataKey, skylink, callback, revision = null) {
		showOverlay(this.opts)
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		if (revision === null) {
			// fetch the current value to find out the revision.
			const privateKeyBuffer = Buffer.from(privateKey, "hex");
			let entry
			const publicKey = pki.ed25519.publicKeyFromPrivateKey({ privateKey: privateKeyBuffer })
			try {
				entry = await this.skynetClient.registry.getEntry(toHexString(publicKey), dataKey)
				revision = entry.entry.revision + 1
			} catch (err) {
				console.log(err)
			  	revision = 0
			}
		}
	
		// build the registry value
		const newEntry = {
			datakey: dataKey,
			data: skylink,
			revision,
		};
	
		// update the registry
		try {
			await this.skynetClient.registry.setEntry(privateKey, newEntry)
			var success = true
		} catch (error) {
			console.log(error)
			alert('Failed to save entry, please retry.')
			var success = false
		}
		
		callback(success)
	}

	getRegistryUrl(dataKey) {
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		return this.skynetClient.registry.getEntryUrl(publicKey, dataKey)
	}

	// files can be an array, for example document.getElementById('my_input').files
	async uploadDirectory(files, callback) {
		showOverlay(this.opts)
		try {
			 // Get the directory name from the list of files.
			// Can also be named manually, i.e. if you build the files yourself
			// instead of getting them from an input form.
			const filename = getRootDirectory(files[0]);

			// Use reduce to build the map of files indexed by filepaths
			// (relative from the directory).
			
			const directory = files.reduce((accumulator, file) => {
				const path = getRelativeFilePath(file);

				return { ...accumulator, [path]: file };
			}, {});
			var skylink = await this.skynetClient.uploadDirectory(directory, 'uploaded_folder_name');
		} catch (error) {
			var skylink = false
			console.log(error);
		}
		
		hideOverlay(this.opts)
		callback(skylink)
	}



	async uploadEncryptedFile(file, keyDerivationPath, callback) {
		showOverlay(this.opts)

		let skykey = this.deriveChildSeed(keyDerivationPath) // this hash will used as encription key
		try {
		  var skylink = await this.skynetClient.uploadFile(file, { skykeyName: skykey });
		} catch (error) {
		  console.log(error)
		  var skylink = false
		}
		
		hideOverlay(this.opts)
		callback(skylink)
	}

	async downloadEncryptedFile(skylink, keyDerivationPath, callback) {
		showOverlay(this.opts)

		let skykey = this.deriveChildSeed(keyDerivationPath) // this hash will used as decription key
		try {
			this.skynetClient.download(skylink, { skykeyName: skykey });
		} catch (error) {
			console.log(error);
		}
		
		hideOverlay(this.opts)
		callback(skylink)
	}


	signData(data, childSecKey) {
		// NOT IMPLEMENTED YET
	}

	validateMessage(signedMessage, masterPubKey, childPath) {
		// NOT IMPLEMENTED YET
	}

	showOverlay() {
		showOverlay(this.opts)
	}

	hideOverlay() {
		hideOverlay(this.opts)
	}
	
	/*

	Functions below are only for sky-id.hns.siasky.net ;)
	
	*/

	setAccount(appData) {
		if (appData == false){
			this.seed = ''
		} else {
			for (var key in appData) {
				// skip loop if the property is from prototype
				if (!appData.hasOwnProperty(key)) continue
				this[key] = appData[key]
			}
		}
		toggleElementsDisplay(this.seed)
		return true
	}

	setMnemonic(mnemonic, callback, days = 0, checkMnemonic = false) {
		let mnemonicBytes = sia.mnemonics.mnemonicToBytes(mnemonic)
		if (mnemonicBytes.length != 32) {
			callback(false)
			return
		}

		let seed = toHexString(mnemonicBytes)
		setCookie({"seed": seed}, days)

		if (checkMnemonic && this.setAccount({"seed": seed}, days)) {
			var self = this
			skyid.getJSON('profile', function(response, revision) {
				if (response == '') { // file not found
					self.sessionDestroy()
					callback(false)
				} else {
					callback(true)
				}
			})
		} else {
			callback(this.setAccount({"seed": seed}, days))
		}		
	}
	
	generateNewMasterSeed() {
		if (this.seed != '') {
			throw "redeclaration of master seed. skyid.generateNewMasterSeed() called after skyid cookie was set already. If you want, you can skyid.sessionDestroy()"
		} else {
			let rendomData = sia.keyPair.generateRandomData()		
			let mnemonic = sia.mnemonics.bytesToMnemonic(rendomData)
			return mnemonic
		}
	}
}