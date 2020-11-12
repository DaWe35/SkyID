import { getCookie, setCookie, delCookie, redirectToSkappContainer, popupCenter,
	toggleElementsDisplay, showOverlay, hideOverlay, toHexString } from "./utils"
import { SkynetClient, genKeyPairFromSeed, deriveChildSeed } from "skynet-js";
import { pki } from "node-forge";
const sia = require('sia-js')
global.Buffer = global.Buffer || require('buffer').Buffer


window.SkyID = class SkyID {
	constructor(appId, callback = null) {
		this.callback = callback
		this.appId = appId
		if (window.location.protocol == 'file:' || window.location.hostname == 'idtest.local' || window.location.hostname == 'skynote.local') {
			this.skynetClient = new SkynetClient('https://siasky.net')
		} else {
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
	}

	sessionStart() {
		let redirect = redirectToSkappContainer(window.location)
		if (redirect == null) {
			alert('Error: unable to detect dapp container URL')
		} else {
			if (redirect != false) {
				window.location.href = redirect
			}

			if (window.location.protocol == 'file:' || window.location.hostname == 'idtest.local' || window.location.hostname == 'skynote.local') {
				//for testing
				window.windowObjectReference = popupCenter(
					'http://idtest.local/connect.html?appId=' + this.appId,
					'SkyID',
					400, 500
				)
			} else {
				window.windowObjectReference = popupCenter(
					'https://sky-id.hns.siasky.net/connect.html?appId=' + this.appId,
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
		return deriveChildSeed(this.seed, derivatePath)
	}

	// alias for compatibility
	async getFile(dataKey, callback) {
		this.getJSON(dataKey, callback)
	}
	async setFile(dataKey, json, callback) {
		this.setJSON(dataKey, json, callback)
	}

	async getJSON(dataKey, callback) {
		showOverlay()
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		try {
			var { data, revision } = await this.skynetClient.db.getJSON(publicKey, dataKey)
		} catch (error) {
			var data = ''
			var revision = 0
		}
		hideOverlay()
		callback(data, revision)
	}

	async setJSON(dataKey, json, callback) {
		showOverlay()
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		try {
			await this.skynetClient.db.setJSON(privateKey, dataKey, json)
			var success = true
		} catch (error) {
			console.log(error)
			alert('Failed to save file, please retry.')
			var success = false
		}
		hideOverlay()
		callback(success)
	}

	async getRegistry(dataKey, callback) { // needs DaWe's fork of skynet-js-2.4.0
		showOverlay()
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		try {
			var entry = await this.skynetClient.registry.getEntry(publicKey, dataKey)
		} catch (error) {
			var entry = false
		}
		hideOverlay()
		callback(entry)
	}

	async setRegistry(dataKey, skylink, callback, revision = null) {
		showOverlay()
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

	signData(data, childSecKey) {
		
	}

	validateMessage(signedMessage, masterPubKey, childPath) {
		// NOT IMPLEMENTED YET
	}

	/*

	Functions below are only for SkyID, so it is better to not use ;)
	
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