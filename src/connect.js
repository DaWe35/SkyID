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
			var eventCode = 'login_fail'
			var seed = false
		} else if (grantAccess === true) {
			var eventCode = 'login_success'
			var seed = this.skyid.generateChildSeed(this.appId)
		}
		window.opener.postMessage({'sender': 'skyid', 'eventCode': eventCode, 'seed': seed}, "*")
		window.close()
	}

	showAlert(text, type) {
		alert(text)
		if (type == 'error') {
			window.close()
		}
	}
}