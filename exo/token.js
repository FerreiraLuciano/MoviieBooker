const user = {
	name: "l",
	email: "l@gmail.com",
}

function generateToken(user) {

	return btoa(JSON.stringify(user));
}

function verifyToken(token) {

	return atob(token);
}

const token = generateToken(user);
console.log("generated token : ", token);

const verified = verifyToken(token);
console.log("verified token : ", JSON.stringify(verified));
