const sia = require('sia-js')
import { getCookie, setCookie } from "./utils"
global.Buffer = global.Buffer || require('buffer').Buffer

// class for the main SkyID account & for dapp accounts
export class Account {
	constructor() {
		this.seed = getCookie()
		this.userData = {}
	}

	setSeed(seed, days = 1) {
		this.seed = seed
		setCookie(seed, days)
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

	sessionDestroy(redirectUrl = null) {
		setCookie('', -1)
		if (redirectUrl === null) {
			location.reload()
		} else {
			window.location.href = redirectUrl
		}
	}

	generateChildAccount(masterKey) {

	}

}