window.SkyidConnect = class SkyidConnect {

	constructor(opts = null) {
		this.skyid = new SkyID('SkyID', null, opts)

		const urlParams = new URLSearchParams(window.location.search)
		this.appId = urlParams.get('appId')

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

		if (typeof this.appId == 'undefined' || this.appId == null || this.appId == '') {
			this.showAlert('Misconfigured dapp - appId is empty', 'error')
		}

		// print appId to page
		let appId_print_elems = document.getElementsByClassName('appId')
		for (let index = 0; index < appId_print_elems.length; index++) {
			appId_print_elems[index].innerHTML = this.appId
		}

		let devMode = urlParams.get('devMode')
		if (typeof devMode != 'undefined' && devMode == 'true') {
			let html = `<div id="devmode_warn" style="position: fixed; top: 10%; width: 80%; height:80%; left: 10%; background-color: #B71C1C; padding: 5px 20px; z-index: 199999; color: white; font-size: 100%; padding: 10%">
				<span style="float:right; padding-left: 10px; cursor: pointer;" onclick="document.getElementById('devmode_warn').style.display = 'none'">x</span>
				<p><b>This app wants to save cookies to unsafe domain.</b></p>
				<p>If you're not a developer, we recommend you to deny access to your data.</p>
				<p><small>If you're a developer then it's fine, but note that cookie saving won't work on Chrome/Brave because your dapp is opened directly with file:// protocol. To get it work, you can use any localhost domain or use Firefox.</small></p>
			</div>`
			var div = document.createElement("div")
			div.innerHTML = html
			document.body.appendChild(div.firstChild)
		}

		// TODO
		// Check is document.referrer the same as the register page was
		// window.opener.parent.location.href

	}

	CloseMySelf(grantAccess) {
		if (grantAccess === false) {
			window.opener.postMessage({ 'sender': 'skyid', 'eventCode': 'login_fail', 'seed': false }, "*")
			window.close()
		} else if (grantAccess === true) {
			var { postMessage, publicAppData } = this.skyid.makeLoginSuccessPayload(this.appId, document.referrer);

			this.addDapp(this.appId, publicAppData, function () {
				window.opener.postMessage(postMessage, "*")
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
		this.skyid.getJSON('profile', function (response, revision) {
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
				self.skyid.setJSON('profile', jsonProfile, function (success) {
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
