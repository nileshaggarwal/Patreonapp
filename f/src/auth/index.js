export const signup = user => {
	return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const signin = user => {
	return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(user),
	})
		.then(response => response.json())
		.catch(err => console.log(err));
};

export const authenticate = (data, next) => {
	Object.assign(data.user, { xp: Date.now() + 64800000 }); //18 hours
	if (typeof window !== "undefined") {
		localStorage.setItem("jwt", JSON.stringify(data));
		next();
	}
};

export const isAuthenticated = () => {
	if (typeof window == "undefined") {
		return false;
	}
	if (localStorage.getItem("jwt")) {
		const data = JSON.parse(localStorage.getItem("jwt"));
		if (data.user.xp <= Date.now()) localStorage.removeItem("jwt");
		else return data;
	} else {
		return false;
	}
};

export const signout = next => {
	if (typeof window !== "undefined") {
		localStorage.removeItem("jwt");
		next();
	}
};
