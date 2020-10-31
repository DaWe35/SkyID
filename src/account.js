const sia = require('sia-js')
import { SkynetClient, keyPairFromSeed } from "skynet-js";
import { getCookie, setCookie } from "./utils"
global.Buffer = global.Buffer || require('buffer').Buffer

// class for the main SkyID account & for dapp accounts
export class Account {
	constructor() {
		this.client = new SkynetClient()
		this.seed = getCookie()
		this.userData = {}
	}

	setSeed(seed, days = 1) {
		this.seed = seed
		setCookie(seed, days)
		return true
	}

	addUserData() {
		this.userData
	}

	modifyUserData() {
		this.userData
	}

	removeUserData() {
		this.userData
	}

	/* getRegistry() {
		const appID = "SkySkapp";
		const filename = "foo.txt";
		const user = User.New("john.doe@example.com", "supersecret");
		const fileID = new FileID(appID, FileType.PublicUnencrypted, filename);

		getFileExample() {
			try {
				client.getFile(user, fileID);
			} catch (error) {
				console.log(error)
			}
		}
	}

	setRegistry() {
		const client = new SkynetClient();

		const appID = "SkySkapp";
		const filename = "foo.txt";
		const user = User.New("john.doe@example.com", "supersecret");
		const fileID = new FileID(appID, FileType.PublicUnencrypted, filename);
	
		// Must have an existing File object.
	
		async function setFileExample() {
			try {
				client.setFile(user, fileID, SkyFile.New(file);
			} catch (error) {
				console.log(error)
			}
		}
	} */



	generateNewMasterSeed() {
		if (this.seed != '') {
			throw "redeclaration of master seed. skyid.generateNewMasterSeed() called after skyid cookie was set already. If you want, you can skyid.sessionDestroy()"
		} else {
			const client = new SkynetClient();
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

	generateDappAccount(masterKey) {

	}

	signData(data, childSecKey) {
		
	}

	validateMessage(signedMessage, masterPubKey, childPath) {

	}

}