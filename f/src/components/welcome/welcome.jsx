import React, { useEffect, useState } from "react";
import { isAuthenticated, signout } from "../../auth";
import { Link } from "react-router-dom";

const linkpatreon = () => {
	fetch(`${process.env.REACT_APP_API_URL}/patreon-link`, {
		method: "GET",
		headers: { "x-access-token": isAuthenticated().token },
	})
		.then(r => r.json())
		.then(link => (window.location.href = link))
		.catch(console.log);
};

const Welcome = ({ history }) => {
	const unlink = () => {
		fetch(`${process.env.REACT_APP_API_URL}/unlink`, {
			method: "GET",
			headers: { "x-access-token": isAuthenticated().token },
		}).then(r => getData());
	};

	const getData = () => {
		if (isAuthenticated())
			fetch(`${process.env.REACT_APP_API_URL}/getData`, {
				method: "GET",
				headers: { "x-access-token": isAuthenticated().token },
			})
				.then(da => da.json())
				.then(dat => {
					setData(dat);
					setGettingData(false);
				})
				.catch(console.log);
	};

	const [gettingData, setGettingData] = useState(true);
	const [data, setData] = useState({});

	useEffect(() => {
		getData();
	}, []);

	return (
		<div style={{ textAlign: "center" }}>
			{isAuthenticated() ? (
				<>
					<h2>Welcome {isAuthenticated().user.name}!</h2>
					{data.error ? <h5>{data.error}</h5> : ""}
					<div
						style={{
							margin: "40px",
							padding: "50px",
							border: "5px solid red",
						}}
					>
						{gettingData ? (
							<img
								style={{ width: "50px" }}
								src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Youtube_loading_symbol_1_(wobbly).gif"
								alt="loading"
							/>
						) : (
							<h2>
								{data.tier === null
									? data.isLinked === false
										? "Patreon Account not Linked"
										: "You're not a Patron. Subscribe now!"
									: `Your Current Tier: ${data.tier}`}
								{data.isLinked === false && (
									<p>
										<button onClick={linkpatreon}>Link Patreon</button>
									</p>
								)}
							</h2>
						)}
					</div>

					<button
						style={{ margin: "20px" }}
						onClick={() => {
							signout(() => {
								history.push("/signin");
							});
						}}
					>
						Log Out
					</button>
					{data.isLinked && (
						<button style={{ margin: "20px" }} onClick={unlink}>
							Unlink Patreon Account
						</button>
					)}
				</>
			) : (
				<>
					<h3>Not logged in.</h3>
					<Link to="/signin">Signin</Link>or
					<Link to="/signup">Signup</Link>
				</>
			)}
		</div>
	);
};

export default Welcome;
