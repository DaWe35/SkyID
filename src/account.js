const sia = require('sia-js')
import { FileID, FileType, SkynetClient, SkynetFile, User } from "skynet-js"
global.Buffer = global.Buffer || require('buffer').Buffer

export class Account {
	generateRandomKeypair() {
		let randomData = sia.keyPair.generateRandomData()
		
		let nonce = Buffer.from([0,0,0,0,0,0,0,0])
		let arr = [randomData, nonce]
		
		let seed = Buffer.concat(arr)
		// show the words
		// var words = mnemonic.toMnemonic(data)
		
		// console.log(data) 
		let keypair = sia.keyPair.generateFromSeed(seed)

		let mnemonic = sia.mnemonics.bytesToMnemonic(randomData)

		document.getElementById('mnemonic').innerHTML = mnemonic
		document.getElementById('seckey').innerHTML = keypair['privateKey']
		document.getElementById('pubkey').innerHTML = keypair['publicKey']
		document.getElementById('address').innerHTML = keypair['address']
	}

	/* const client = new SkynetClient();

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
	} */
}