export class SkyidConnect {

	constructor() {
		const urlParams = new URLSearchParams(window.location.search)
		const appId = urlParams.get('appid')
		if (appId == null || appId == '') {
			this.showAlert('Misconfigured dapp - appId is empty', 'error')
		}
		let appid_print_elems = document.getElementsByClassName('appid')
		for (let index = 0; index < appid_print_elems.length; index++) {
			appid_print_elems[index].innerHTML = appId
		}

		// Check is document.referrer the same as the register page was

	}

	CloseMySelf(data) {
		window.opener.postMessage({'sender': 'skyid', 'type': 'login', 'data': data}, "*")
		window.close()
	}

	showAlert(text, type) {
		alert(text)
		if (type == 'error') {
			window.close()
		}
	}
}