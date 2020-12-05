import React, { Component } from "react";
import { signin, authenticate, isAuthenticated } from "../../auth";
import { Redirect } from "react-router-dom";

class Signin extends Component {
	constructor(props) {
		super(props);
		this.state = {
			signInEmail: "",
			signInPassword: "",
		};
	}

	onEmailChange = e => this.setState({ signInEmail: e.target.value });
	onPasswordChange = e => this.setState({ signInPassword: e.target.value });

	onSubmitSignIn = e => {
		this.setState({ ...this.state, error: false, loading: true });
		e.preventDefault();
		const { signInEmail, signInPassword } = this.state;
		signin({ email: signInEmail, password: signInPassword })
			.then(data => {
				if (data.error) {
					this.setState({ ...this.state, error: data.error, loading: false });
				} else {
					authenticate(data, () => {
						this.setState({ didRedirect: true });
					});
				}
			})
			.catch(error => {
				console.log(error);
				this.setState({ loading: false });
			});
	};

	performRedirect = () => {
		if (isAuthenticated().user) return <Redirect to="/" />;
	};

	loadingMessage = () => this.state.loading && <h2>Loading...</h2>;

	errorMessage = () => (
		<div style={{ display: this.state.error ? "" : "none" }}>
			{this.state.error}
		</div>
	);

	render() {
		return (
			<div style={{ textAlign: "center" }}>
				{this.loadingMessage()}
				{this.errorMessage()}
				<label htmlFor="email-address">Email</label>
				<input
					onChange={this.onEmailChange}
					type="text"
					name="email"
					id="email-address"
				/>{" "}
				<br />
				<label htmlFor="password">Password</label>
				<input
					onChange={this.onPasswordChange}
					type="password"
					name="password"
					id="password"
				/>
				<br />
				<input onClick={this.onSubmitSignIn} type="submit" value="Sign in" />
				{this.performRedirect()}
			</div>
		);
	}
}

export default Signin;
