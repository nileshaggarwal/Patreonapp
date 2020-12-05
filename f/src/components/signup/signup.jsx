import React, { Component } from "react";
import { signup, authenticate, isAuthenticated } from "../../auth";
import { Redirect } from "react-router-dom";

class Signup extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name: "",
			username: "",
			email: "",
			password: "",
			data: {},
		};
	}

	onEmailChange = e => {
		this.setState({ email: e.target.value });
	};
	onPasswordChange = e => {
		this.setState({ password: e.target.value });
	};
	onNameChange = e => {
		this.setState({ name: e.target.value });
	};
	onUsernameChange = e => {
		this.setState({ username: e.target.value });
	};

	onSubmitSignUp = ev => {
		this.setState({ ...this.state, error: false, loading: true });
		ev.preventDefault();
		const { name, email, password } = this.state;
		signup({ name, email, password })
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
				this.setState({ loading: false });
				console.log(error);
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
				<label htmlFor="username">Username</label>
				<input
					onChange={this.onUsernameChange}
					type="text"
					name="username"
					id="username"
				/>
				<br />
				<label htmlFor="name">Name</label>
				<input onChange={this.onNameChange} type="text" name="name" id="name" />
				<br />
				<label htmlFor="email-address">Email</label>
				<input
					onChange={this.onEmailChange}
					type="text"
					name="email"
					id="email-address"
				/>
				<br />
				<label htmlFor="password">Password</label>
				<input
					onChange={this.onPasswordChange}
					type="password"
					name="password"
					id="password"
				/>
				<br />
				<input onClick={this.onSubmitSignUp} type="submit" value="Sign Up!" />
				{this.performRedirect()}
			</div>
		);
	}
}

export default Signup;
