import { genKeyPairFromSeed } from "skynet-js";

window.SkyidConnect = class SkyidConnect {

	constructor(opts = null) {
		const urlParams = new URLSearchParams(window.location.search)
		this.appId = urlParams.get('appId')
		this.skyid = new SkyID('SkyID', null, opts)

		// if login needed to SkyID master account
		if (typeof this.skyid.seed == 'undefined' || this.skyid.seed == '') {
			document.getElementById('accessCard').style.display = 'none'
			document.getElementById('needLoginCard').style.display = 'block'

			window.addEventListener("message", (event) => {
				if (typeof event.data.sender != 'undefined' && event.data.sender == 'skyid') {
					if (event.data.eventCode == 'master_login_success') {
						document.getElementById('accessCard').style.display = 'block'
						document.getElementById('needLoginCard').style.display = 'none'
					}
				}
			}, false)

		}
		if (this.appId == null || this.appId == '' || typeof this.appId == 'undefined') {
			this.showAlert('Misconfigured dapp - appId is empty', 'error')
		}

		// print appId to page
		let appId_print_elems = document.getElementsByClassName('appId')
		for (let index = 0; index < appId_print_elems.length; index++) {
			appId_print_elems[index].innerHTML = this.appId
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
			var appSeed = this.skyid.deriveChildSeed(this.appId)
			// generate private app data
			const masterKeys = genKeyPairFromSeed(this.skyid.seed)
			let appData =  { 'seed': appSeed,'userId': masterKeys.publicKey, 'url': document.referrer, 'appImg': null }

			// generate public app data
			const { publicKey, privateKey } = genKeyPairFromSeed(appSeed)
			let publicAppData = { 'url': document.referrer, 'publicKey': publicKey, 'img': null }
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

	skyidLogin() {
		window.location.href = "/?appId=" + this.appId + "&redirect=backConnect"
	}

	addDapp(appId, appData, callback) {
		// fetch file
		var self = this;
		this.skyid.getJSON('profile', function(response, revision) {
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
				self.skyid.setJSON('profile', jsonProfile, function(success) {
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