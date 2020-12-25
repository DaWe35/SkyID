function generateRandomAvatarUrl() {
	let rand = getRandomInt(0, 99)
	return 'RABycdgWznT8YeIk57CDE9w0CiwWeHi7JoYOyTwq_UaSXQ/' + rand
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
