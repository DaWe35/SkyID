var blake = require('blakejs')
const nacl = require('tweetnacl')
global.Buffer = global.Buffer || require('buffer').Buffer


function hasStrongRandom() {
	return 'crypto' in window && window['crypto'] !== null
}

function toHexString(byteArray) {
	return Array.from(byteArray, function(byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2)
	}).join('')
}

/* var mnemonics = { "english": new Mnemonic("english") }
var mnemonic = mnemonics["english"] */

if (!hasStrongRandom()) {
	var errorText = "This browser does not support strong randomness"
	alert(errorText)
	// return
}

// get the amount of entropy to use
var numWords = 24
var strength = numWords / 3 * 32
var buffer = new Uint8Array(strength / 8) // 32
// create secure entropy
var random_data = crypto.getRandomValues(buffer)

var nonce = Buffer.from([0,0,0,0,0,0,0,0])
var arr = [random_data, nonce]

var seed = Buffer.concat(arr)
console.log(seed)
// show the words
/* var words = mnemonic.toMnemonic(data)

console.log(data) */

hash = blake.blake2b(seed, false, 32)

specifier = Buffer.from([101,100,50,53,53,49,57,0,0,0,0,0,0,0,0,0])
keypair = nacl.sign.keyPair.fromSeed(hash)
pubkey = toHexString(Buffer.concat([specifier, keypair['publicKey']]))
console.log(pubkey)
console.log(keypair['publicKey'])

