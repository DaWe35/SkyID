import {redirectToSkappContainer} from "./utils"
import {Account} from "./account"
import { SkynetClient, keyPairFromSeed } from "skynet-js";

window.SkyID = class SkyID {
	constructor(appid, sessionCallback) {
		this.appid = appid
		this.account = new Account()
		this.skynetClient = new SkynetClient()
		window.addEventListener("message", (event) => {
			if (typeof event.data.sender != 'undefined' && event.data.sender == 'skyid') {
				console.log("event.data", event.data)
				let message = event.data
				sessionCallback(message)
			}
		}, false)
	}

	sessionStart() {
		let redirect = redirectToSkappContainer(window.location)
		if (redirect == null) {
			alert('Error: unable to detect dapp container URL')
		} else {
			if (red != false) {
				window.location.href = redirect
			}
			// NOT IMPLEMENTED YET
			window.windowObjectReference = window.open(
				"../skyid_dashboard/connect.html?appid=" + this.appid,
				"DescriptiveWindowName",
				"resizable,scrollbars,status,width=400,height=500"
			)
		}
	}

	
	getRegistry(dataKey) {
		const { publicKey, privateKey } = keyPairFromSeed(this.account.seed);
		
		async function getJSONExample() {
		  try {
			const { data, revision } = await client.db.getJSON(publicKey, dataKey);
		  } catch (error) {
			console.log(error);
		  }
		}
	}

	setRegistry(filename, json) {
		const { publicKey, privateKey } = keyPairFromSeed(this.account.seed);

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
		user = {
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
}