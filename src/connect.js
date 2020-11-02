import { keyPairFromSeed } from "skynet-js";
window.SkyidConnect = class SkyidConnect {

	constructor() {
		const urlParams = new URLSearchParams(window.location.search)
		this.appId = urlParams.get('appid')
		this.skyid = new SkyID()
		if (this.skyid.seed == '') {
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

	}

	CloseMySelf(grantAccess) {
		if (grantAccess === false) {
			window.opener.postMessage({'sender': 'skyid', 'eventCode': 'login_fail', 'seed': false}, "*")
			window.close()
		} else if (grantAccess === true) {
			var seed = this.skyid.generateChildSeed(this.appId)
			const { publicKey, privateKey } = keyPairFromSeed(seed)
			let appData = { 'url': document.referrer, 'publicKey': publicKey, 'img': null }
			this.addDapp(this.appId, appData, function() {
				window.opener.postMessage({'sender': 'skyid', 'eventCode': 'login_success', 'seed': seed}, "*")
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
		console.log(appId, appData, callback)
		// fetch file
		var self = this;
		this.skyid.getFile('profile', function(response, revision) {
			console.log('call appadd, response:', response)
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