/*

Crypto functions were copied from https://github.com/sh-dv/hat.sh (commit: a82f053e9f92bb8c003e5d63a3683d6dceb12abc)

*/


//declarations
const DEC = {
	signature: "RW5jcnlwdGVkIFVzaW5nIEhhdC5zaA", //add a line in the file that says "encrypted by Hat.sh :)"
	hash: "SHA-512",
	algoName1: "PBKDF2",
	algoName2: "AES-GCM",
	algoLength: 256,
	itr: 80000,
	salt: window.crypto.getRandomValues(new Uint8Array(16)),
	perms1: ["deriveKey"],
	perms2: ['encrypt', 'decrypt'],
}
    

//better function to convert string to array buffer
//as done in the webcrypto documentation
function str2ab(str) {
	const buf = new ArrayBuffer(str.length)
	const bufView = new Uint8Array(buf)
	for (let i = 0, strLen = str.length; i < strLen; i++) {
		bufView[i] = str.charCodeAt(i)
	}
	return buf
}

//import key
// import the entered key from the password input
function importSecretKey(encryptSeed) { 
	if (typeof encryptSeed != 'string') {
		throw TypeError('seed must be a string, got ' + (typeof encryptSeed))
	}
	let rawPassword = str2ab(encryptSeed); // convert the password entered in the input to an array buffer
	return window.crypto.subtle.importKey(
		"raw", //raw
		rawPassword, // array buffer password
		{
			name: DEC.algoName1
		}, //the algorithm you are using
		false, //whether the derived key is extractable 
		DEC.perms1 //limited to the option deriveKey
	)
}


async function deriveEncryptionSecretKey(encryptSeed) { //derive the secret key from a master key.

	let getSecretKey = await importSecretKey(encryptSeed)

	return window.crypto.subtle.deriveKey({
			name: DEC.algoName1,
			salt: DEC.salt,
			iterations: DEC.itr,
			hash: {
				name: DEC.hash
			},
		},
		getSecretKey, //your key from importKey
		{ //the key type you want to create based on the derived bits
			name: DEC.algoName2,
			length: DEC.algoLength,
		},
		false, //whether the derived key is extractable 
		DEC.perms2 //limited to the options encrypt and decrypt
	)
	//console.log the key
	// .then(function(key){
	//         //returns the derived key
	//         console.log(key)
	// })
	// .catch(function(err){
	//         console.error(err)
	// })

}

//file encryption function
export async function encryptFile(file, encryptSeed, callback) {
	//check if file and password inputs are entered
	const derivedKey = await deriveEncryptionSecretKey(encryptSeed); //requiring the key
	console.log(derivedKey)
	const fr = new FileReader(); //request a file read

	const n = new Promise((resolve, reject) => {

		fr.onloadstart = async () => {
			// $(".loader").css("display", "block"); //show spinner while loading a file
		}

		fr.onload = async () => { //load

			const iv = window.crypto.getRandomValues(new Uint8Array(16)); //generate a random iv
			const content = new Uint8Array(fr.result); //encoded file content
			// encrypt the file
			await window.crypto.subtle.encrypt({
					iv,
					name: DEC.algoName2
				}, derivedKey, content) 
				.then(function (encrypted) {
					//returns an ArrayBuffer containing the encrypted data
					console.log('encrypted-in', encrypted)
					const encFile = [window.atob(DEC.signature), iv, DEC.salt, new Uint8Array(encrypted)]
					const blob = new Blob(encFile, {
						type: 'application/octet-stream'
					})
					callback(blob) //create the new file buy adding signature and iv and content
					//console.log("file has been successuflly encrypted")
				})
				.catch(function (err) {
					console.log(err)
					callback(false) //reject
				})
		}
		//read the file as buffer
		fr.readAsArrayBuffer(file)

	})
}



export function fetchFile(url, filename, callback) {
	fetch(url).then((response) => {
		var reader = response.body.getReader();
		var bytesReceived = 0;

		return reader.read().then(function processResult(result) {
			// Result objects contain two properties:
			// done  - true if the stream has already given
			//         you all its data.
			// value - some data. Always undefined when
			//         done is true.
			if (result.done) {
				console.log('Fetch complete');
				let blob = response.blob()
				var file = new File([blob], filename)
				callback(file)
				return;
			}
	  
		  // result.value for fetch streams is a Uint8Array
		  bytesReceived += result.value.length;
		  console.log('Received', bytesReceived, 'bytes of data so far');
	  
		  return reader.read().then(processResult);
		});
	  });



	  
	/* fetch(url)
	.then(resp => resp.blob())
	.then(blob => {
		var file = new File([blob], filename)
		callback(file)
	})
	.catch(
		() => callback(false)
	); */
}


//file decryption function

export async function decryptFile(file, encryptSeed, callback) {
	const fr = new FileReader(); //request a file read
	const d = new Promise((resolve, reject) => {

		fr.onload = async () => { //load 
			
			async function deriveDecryptionSecretKey() { //derive the secret key from a master key.

				let getSecretKey = await importSecretKey(encryptSeed)

				return window.crypto.subtle.deriveKey({
						name: DEC.algoName1,
						salt: new Uint8Array(fr.result.slice(38, 54)), //get salt from encrypted file.
						iterations: DEC.itr,
						hash: {
							name: DEC.hash
						},
					},
					getSecretKey, //your key from importKey
					{ //the key type you want to create based on the derived bits
						name: DEC.algoName2,
						length: DEC.algoLength,
					},
					false, //whether the derived key is extractable 
					DEC.perms2 //limited to the options encrypt and decrypt
				)
				//console.log the key
				// .then(function(key){
				//         //returns the derived key
				//         console.log(key)
				// })
				// .catch(function(err){
				//         console.error(err)
				// })
			
			}

			//console.log(fr.result)
			const derivedKey = await deriveDecryptionSecretKey(); //requiring the key

			const iv = new Uint8Array(fr.result.slice(22, 38)); //take out encryption iv

			const content = new Uint8Array(fr.result.slice(54)); //take out encrypted content

			await window.crypto.subtle.decrypt({
					iv,
					name: DEC.algoName2
				}, derivedKey, content)
				.then(function (decrypted) {
					//returns an ArrayBuffer containing the decrypted data
					var data = [new Uint8Array(decrypted)]
					const blob = new Blob(data, {
						type: 'application/octet-stream'
					})
					const url = URL.createObjectURL(blob)
					callback(url) //create new file from the decrypted content
					//console.log("file has been successuflly decrypted")
				})
				.catch(function () {
					callback(false)
					alert("You have entered a wrong Decryption Key!")
				})

		}

		fr.readAsArrayBuffer(file) //read the file as buffer

	})

}
