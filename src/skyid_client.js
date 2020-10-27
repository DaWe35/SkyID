import {isSkylinkPage, redirectToSkappContainer} from "./utils"
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
		// BROKEN ON https://pg0anies87je55r4ngqssqce4o3cirn9dfu38nmbvef6tudpoohlhlo.siasky.net/example_skapp.html
		if (isSkylinkPage()) {
			let red = redirectToSkappContainer(window.location)
			window.location.href = red
		}
		// NOT IMPLEMENTED YET
		window.windowObjectReference = window.open(
			"../main/connect/example_connect.html?appid=" + this.appid,
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