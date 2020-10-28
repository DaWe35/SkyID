const sia = require('sia-js')
import { FileID, FileType, SkynetClient, SkynetFile, User } from "skynet-js"
global.Buffer = global.Buffer || require('buffer').Buffer

// class for the main SkyID account & for dapp accounts
export class Account {
	constructor() {
		this.client = new SkynetClient()
		this.secKey = false
		this.pubKey = false
		this.address = false
		this.mnemonic = false
		this.userData = {}
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



	generateNewMasterKey() {
		let seed = sia.keyPair.generateRandomData()
		let nonce = Buffer.from([0,0,0,0,0,0,0,0])
		return this.generateKey(seed, nonce)
	}

	generateKey(seed, nonce) {
		let arr = [seed, nonce]
		let deterministicSeed = Buffer.concat(arr)

		let keypair = sia.keyPair.generateFromSeed(deterministicSeed)
		let mnemonic = sia.mnemonics.bytesToMnemonic(seed)

		this.secKey = keypair['privateKey']
		this.pubKey = keypair['publicKey']
		this.address = keypair['address']
		this.mnemonic = mnemonic
		return true
	}

	generateDappAccount(masterKey) {

	}

	signData(data, childSecKey) {
		
	}

	validateMessage(signedMessage, masterPubKey, childPath) {

	}

}