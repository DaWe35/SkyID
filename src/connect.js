import { keyPairFromSeed } from "skynet-js";
import { toHexString } from "./utils"

window.SkyidConnect = class SkyidConnect {

	constructor() {
		const urlParams = new URLSearchParams(window.location.search)
		this.appId = urlParams.get('appid')
		this.skyid = new SkyID()
		if (typeof this.skyid.seed == 'undefined') {
			alert('Please login to SkyID first!')
		}
		if (this.appId == null || this.appId == '') {
			this.showAlert('Misconfigured dapp - appId is empty', 'error')
		}

		// print appid to page
		let appid_print_elems = document.getElementsByClassName('appid')
		for (let index = 0; index < appid_print_elems.length; index++) {
			appid_print_elems[index].innerHTML = this.appId
		}

		// TODO
		// Check is document.referrer the same as the register page was
		// window.opener.parent.location.href

	}

	CloseMySelf(grantAccess) {
		if (grantAccess === false) {
			window.opener.postMessage({'sender': 'skyid', 'eventCode': 'login_fail', 'seed': false}, "*")
			window.close()
		} else if (grantAccess === true) {
			var appSeed = this.skyid.generateChildSeed(this.appId)
			
			// generate private app data
			const masterKeys = keyPairFromSeed(this.skyid.seed)
			let userIdHex = toHexString(masterKeys.publicKey)
			let appData =  { 'seed': appSeed,'userId': userIdHex, 'url': document.referrer, 'appImg': null }

			// generate public app data
			const { publicKey, privateKey } = keyPairFromSeed(appSeed)
			let publicKeyHex = toHexString(publicKey)
			let publicAppData = { 'url': document.referrer, 'publicKey': publicKeyHex, 'img': null }
			this.addDapp(this.appId, publicAppData, function() {
				window.opener.postMessage({'sender': 'skyid', 'eventCode': 'login_success', 'appData': appData}, "*")
				window.close()
			})
		}

	}

	showAlert(text, type) {
		alert(text)
		if (type == 'error') {
			window.close()
		}
	}

	addDapp(appId, appData, callback) {
		// fetch file
		var self = this;
		this.skyid.getFile('profile', function(response, revision) {
			if (response == '') { // file not found
				alert('Error: unable to fetch dapp list')
				console.log('Error: unable to fetch dapp list')
			} else { // success
				var profileObj = JSON.parse(response)
				if (typeof profileObj.dapps == 'undefined') {
					profileObj.dapps = {}
				}
				profileObj.dapps[appId] = appData

				// set file
				let jsonProfile = JSON.stringify(profileObj)
				self.skyid.setFile('profile', jsonProfile, function(success) {
					console.log('File Set')
					if (!success) {
						alert('Error: unable to save profile.json')
					} else {
						callback()
					}
				})
			}
		})
	}
}