import {redirectToSkappContainer} from "./utils"


// console.log('B32', base32Regex.test('rg0r82aj56cf2irtanf60bg5h6gl13lp8geb0ovl05pmrgecbkmhp5o.'))
// console.log('B32 utána +', base32Regex.test('rg0r82aj56cf2irtanf60bg5h6gl13lp8geb0ovl05pmrgecbkmhp5oa.'))
// console.log('B32 előtte +', base32Regex.test('arg0r82aj56cf2irtanf60bg5h6gl13lp8geb0ovl05pmrgecbkmhp5o.'))
// console.log('B32 utána á', base32Regex.test('rg0r82aj56cf2irtanf60bg5h6gl13lp8geb0ovl05pmrgecbkmhp5oá.'))
// console.log('B32 előtte á', base32Regex.test('árg0r82aj56cf2irtanf60bg5h6gl13lp8geb0ovl05pmrgecbkmhp5o.'))


// test urlType()
let links = {
	// "link", "is insecure skylink?"
	"https://rg0r82aj56cf2irtanf60bg5h6gl13lp8geb0ovl05pmrgecbkmhp5o.siasky.net/skyid_client/example_skapp.html": false,
	"https://siasky.net/3AG0CVMpmPFLfVXeYC4FiaFQjrlEHLBj9QFzbcHMXS0clw/skyid_client/example_skapp.html": 'https://rg0r82aj56cf2irtanf60bg5h6gl13lp8geb0ovl05pmrgecbkmhp5o.siasky.net/skyid_client/example_skapp.html',
	"https://siasky.net/3AG0CVMpmPFLfVXeYC4FiaFQjrlEHLBj9QFzbcHMXS0clw/skyid_client": 'https://rg0r82aj56cf2irtanf60bg5h6gl13lp8geb0ovl05pmrgecbkmhp5o.siasky.net/skyid_client',
	"https://skymessage.hns.siasky.net": false,
	"https://skymessage.hns.siasky.net/": false,
	"https://siasky.net/hns/skygallery/#/": 'https://skygallery.hns.siasky.net#/',
	"https://siasky.net/hns/skygallery/": 'https://skygallery.hns.siasky.net',
	"https://siasky.net/hns/skygallery": 'https://skygallery.hns.siasky.net',
	"argehafeau": null,
	"https://siasky.net/hns/skyapps/#/apps/all": "https://skyapps.hns.siasky.net#/apps/all"
}

for (const [key, value] of Object.entries(links)) {
	let skappContainer = redirectToSkappContainer(key)
	if (skappContainer != value) {
		console.log('ERROR: page', key, 'returned', skappContainer, 'expected:', value)
	} else {
		console.log('PASSED')
	}
}

console.log('test finished')