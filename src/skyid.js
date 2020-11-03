import { getCookie, setCookie, redirectToSkappContainer, popupCenter,
	toggleElementsDisplay, encodeBase64, showOverlay, hideOverlay } from "./utils"
import { SkynetClient, keyPairFromSeed, deriveChildSeed } from "skynet-js";
const sia = require('sia-js')
global.Buffer = global.Buffer || require('buffer').Buffer


window.SkyID = class SkyID {
	constructor(appid, callback = null) {
		this.appid = appid
		if (window.location.protocol == 'file:' || window.location.hostname == 'idtest.local' || window.location.hostname == 'skynote.local') {
			this.skynetClient = new SkynetClient('https://siasky.net')
		} else {
			this.skynetClient = new SkynetClient()
		}
		this.seed = getCookie()
		this.callback = callback
		toggleElementsDisplay(this.seed)

		window.addEventListener("message", (event) => {
			if (typeof event.data.sender != 'undefined' && event.data.sender == 'skyid') {
				if (event.data.eventCode == 'login_success') {
					this.setSeed(event.data.seed)
				}
				typeof callback === 'function' && this.callback(event.data.eventCode)
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
					'http://idtest.local/connect.html?appid=' + this.appid,
					'SkyID',
					400, 500
				)
			} else {
				window.windowObjectReference = popupCenter(
					'https://skyaccounts.hns.siasky.net/connect.html?appid=' + this.appid,
					'SkyID',
					400, 500
				)
			}
		}
	}


	sessionDestroy(redirectUrl = null) {
		this.setSeed('', -1)
		if (redirectUrl !== null) {
			window.location.href = redirectUrl
		} else {
			toggleElementsDisplay(this.seed)
		}
		typeof callback === 'function' && this.callback('destroy')
	}



	generateChildSeed(derivatePath) {
		var childSeed = deriveChildSeed(this.seed, derivatePath)
		return encodeBase64(childSeed)
	}

	
	async getFile(dataKey, callback) {
		showOverlay()
		const { publicKey, privateKey } = keyPairFromSeed(this.seed)
		
		try {
			const { data, revision } = await this.skynetClient.db.getJSON(publicKey, dataKey)
			hideOverlay()
			callback(data, revision)
		} catch (error) {
			console.log(error)
			hideOverlay()
			callback('', 0)
			
			// error: 
			// callback(false, -1)
		}
	}

	async setFile(dataKey, json, callback) {
		showOverlay()
		const { publicKey, privateKey } = keyPairFromSeed(this.seed)
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

	signData(data, childSecKey) {
		
	}

	validateMessage(signedMessage, masterPubKey, childPath) {

	}

	getUserData() {
		// NOT IMPLEMENTED YET
		var user = {
			'username': 'Test username',
			'username': 'Test username',
			/*	verificationLevel is a number between 0 and 10
				0 --> user not found, fake/hacked account
				1 --> unverified
				2-10 --> 
			*/
			'verificationLevel': 10
		}
		return user
	}


	/*

	Functions below are only for SkyID, so it is better to not use ;)
	
	*/

	setSeed(seed, days = 0) {
		this.seed = seed
		setCookie(seed, days)
		toggleElementsDisplay(seed)
		return true
	}

	setMnemonic(mnemonic, days = 0) {
		let mnemonicBytes = sia.mnemonics.mnemonicToBytes(mnemonic)
		let seed = encodeBase64(mnemonicBytes)
		return this.setSeed(seed, days)
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