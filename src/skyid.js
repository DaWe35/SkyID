import { getCookie, setCookie, delCookie, redirectToSkappContainer, popupCenter,
	toggleElementsDisplay, encodeBase64, showOverlay, hideOverlay } from "./utils"
import { SkynetClient, genKeyPairFromSeed, deriveChildSeed, getRegistryUrl } from "skynet-js";
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
					'https://skyaccounts.hns.siasky.net/connect.html?appId=' + this.appId,
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



	generateChildSeed(derivatePath) {
		var childSeed = deriveChildSeed(this.seed, derivatePath)
		return encodeBase64(childSeed)
	}

	
	async getFile(dataKey, callback) {
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

	async setFile(dataKey, json, callback) {
		showOverlay()
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		try {
			await this.skynetClient.db.setJSON(privateKey, dataKey, json)

			// control
			this.getFile(dataKey, function(registryData, revision) {
				hideOverlay()
				if (registryData == json) {
					callback(true)
				} else {
					callback(false)
				}
			})
		} catch (error) {
			hideOverlay()
			console.log(error)
		}
	}

	async getRegistry(dataKey, callback) { // needs DaWe's fork of skynet-js-2.4.0
		showOverlay()
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		try {
			var skylink = await this.skynetClient.dbDirect.getRegistry(publicKey, dataKey)
		} catch (error) {
			var skylink = false
		}
		hideOverlay()
		callback(skylink)
	}

	async setRegistry(dataKey, skylink, callback) {
		showOverlay()
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		try {
			await this.skynetClient.dbDirect.setRegistry(privateKey, dataKey, skylink)

			// control
			this.getRegistry(dataKey, function(registryData, revision) {
				hideOverlay()
				if (registryData == skylink) {
					callback(true)
				} else {
					callback(false)
				}
			})
		} catch (error) {
			hideOverlay()
			console.log(error)
		}
	}

	getRegistryUrl(dataKey) {
		const { publicKey, privateKey } = genKeyPairFromSeed(this.seed)
		return this.skynetClient.dbDirect.getRegistryUrl(publicKey, dataKey)
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

		let seed = encodeBase64(mnemonicBytes)
		setCookie({"seed": seed}, days)

		if (checkMnemonic && this.setAccount({"seed": seed}, days)) {
			var self = this
			skyid.getFile('profile', function(response, revision) {
				console.log('response', response)
				if (response == '') { // file not found
					console.log('response is ""')
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