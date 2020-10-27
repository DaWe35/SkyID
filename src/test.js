import {isSkylinkPage} from "./utils"


// test isSkylinkPage()
let links = {
	// "link", "is insecure skylink?"
	"https://rg0r82aj56cf2irtanf60bg5h6gl13lp8geb0ovl05pmrgecbkmhp5o.siasky.net/skyid_client/example_skapp.html": false,
	"https://siasky.net/3AG0CVMpmPFLfVXeYC4FiaFQjrlEHLBj9QFzbcHMXS0clw/skyid_client/example_skapp.html": true,
	"https://siasky.net/3AG0CVMpmPFLfVXeYC4FiaFQjrlEHLBj9QFzbcHMXS0clw/skyid_client": true,
	"https://skymessage.hns.siasky.net": false,
	"https://skymessage.hns.siasky.net/": false
}

for (const [key, value] of Object.entries(links)) {
	let isSkylinkPageTest = isSkylinkPage(key)
	if (isSkylinkPageTest != value) {
		console.log('ERROR: page ' + key)
	}
}

console.log('test finished')