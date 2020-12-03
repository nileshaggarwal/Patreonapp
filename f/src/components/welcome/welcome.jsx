import React from "react";
import { isAuthenticated, signout } from "../../auth";
import { Link } from "react-router-dom";

const Welcome = ({ history }) => {
	return (
		<>
			{isAuthenticated() ? (
				<>
					<h2>logged in as {isAuthenticated().user.name}</h2>
					<a href="http://localhost:2020/patreon-link">LINK PATREON</a>
					<br />
					<br />
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
