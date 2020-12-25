function generateRandomAvatarUrl() {
	let rand = getRandomInt(0, 1000)
	return 'vAO0h_ICCAc91xxxNIbd4aAEz9B7pnJet-6rrrf64cyXxA/' + rand
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}