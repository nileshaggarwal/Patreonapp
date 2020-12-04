import React, { useEffect, useState } from "react";
import { isAuthenticated, signout } from "../../auth";
import { Link } from "react-router-dom";

const linkpatreon = () => {
	fetch(`http://localhost:2020/patreon-link`, {
		method: "GET",
		headers: { "x-access-token": isAuthenticated().token },
	})
		.then(r => r.json())
		.then(link => (window.location.href = link))
		.catch(console.log);
};

const Welcome = ({ history }) => {
	const [gettingData, setGettingData] = useState(true);
	const [data, setData] = useState({});

	useEffect(() => {
		if (isAuthenticated())
			fetch(`http://localhost:2020/getData`, {
				method: "GET",
				headers: { "x-access-token": isAuthenticated().token },
			})
				.then(da => da.json())
				.then(dat => {
					setData(dat);
					setGettingData(false);
				})
				.catch(console.log);
	}, []);

	return (
		<>
			{isAuthenticated() ? (
				<>
					<h2>logged in as {isAuthenticated().user.name}</h2>

					<div style={{ margin: "40px", border: "5px solid red" }}>
						{gettingData ? (
							<h2>loadin</h2>
						) : (
							<h2>
								Your Tier: {data.tier === null ? "Not a Patron" : data.tier}
								{data.isLinked === false && (
									<button onClick={linkpatreon}>Link Patreon</button>
								)}
							</h2>
						)}
					</div>

					<button
						onClick={() => {
							signout(() => {
								history.push("/signin");
							});
						}}
					>
						signout
					</button>
				</>
			) : (
				<>
					<h3>not logged in</h3>
					<Link to="/signin">Signin</Link>or
					<Link to="/signup">Signup</Link>
				</>
			)}
		</>
	);
};

export default Welcome;
