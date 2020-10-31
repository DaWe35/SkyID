import {urlType, redirectToSkappContainer} from "./utils"
import {Account} from "./account"

window.SkyID = class SkyID {
	constructor(appid, sessionCallback) {
		this.appid = appid
		this.account = new Account()
		window.addEventListener("message", (event) => {
			if (typeof event.data.sender != 'undefined' && event.data.sender == 'skyid') {
				console.log("event.data", event.data)
				let message = event.data
				sessionCallback(message)
			}
		}, false)
	}

	sessionStart() {
		let red = redirectToSkappContainer(window.location)
		if (red == null) {
			alert('Error: unable to detect dapp container URL')
		} else if (red != false) {
			window.location.href = red
		}
		// NOT IMPLEMENTED YET
		window.windowObjectReference = window.open(
			"../main/connect.html?appid=" + this.appid,
			"DescriptiveWindowName",
			"resizable,scrollbars,status,width=400,height=500"
		)
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