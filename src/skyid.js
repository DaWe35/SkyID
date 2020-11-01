import { getCookie, setCookie, redirectToSkappContainer, popupCenter, toggleElementsDisplay } from "./utils"
import { SkynetClient, keyPairFromSeed } from "skynet-js";
const sia = require('sia-js')
global.Buffer = global.Buffer || require('buffer').Buffer


window.SkyID = class SkyID {
	constructor(appid, callback = null) {
		this.appid = appid
		this.skynetClient = new SkynetClient()
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
			// NOT IMPLEMENTED YET
			window.windowObjectReference = popupCenter(
				'https://skynetid.hns.siasky.net/connect.html?appid=' + this.appid,
				'SkyID',
				400, 500
			)
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



	generateChildAccount(masterKey) {

	}

	
	getRegistry(dataKey) {
		const { publicKey, privateKey } = keyPairFromSeed(this.seed);
		
		async function getJSONExample() {
		  try {
			const { data, revision } = await client.db.getJSON(publicKey, dataKey);
		  } catch (error) {
			console.log(error);
		  }
		}
	}

	setRegistry(filename, json) {
		const { publicKey, privateKey } = keyPairFromSeed(this.seed);

		async function setJSONExample() {
			try {
				await client.db.setJSON(privateKey, dataKey, json);
			} catch (error) {
				console.log(error);
			}
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

	setSeed(seed, days = 1) {
		this.seed = seed
		setCookie(seed, days)
		toggleElementsDisplay(seed)
		return true
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