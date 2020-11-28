import React, { Component } from "react";

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

	onEmailChange = e => this.setState({ email: e.target.value });
	onPasswordChange = e => this.setState({ password: e.target.value });
	onNameChange = e => this.setState({ name: e.target.value });
	onUsernameChange = e => this.setState({ username: e.target.value });

	onSubmitSignUp = ev => {
		ev.preventDefault();
		fetch("http://localhost:2020/signup", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				email: this.state.signInEmail,
				password: this.state.signInPassword,
				name: this.state.name,
				// username: this.state.username,
			}),
		})
			.then(resp => resp.json())
			.catch(console.log)
			.then(data => {
				if (data._id) {
					this.setState({ data });
					console.log(data);
				}
			});
	};
	render() {
		return (
			<>
				{this.state.data.name ? (
					`HI ${this.state.data.name}, go to signin!`
				) : (
					<>
						<label htmlFor="username">Username</label>
						<input
							onChange={this.onUsernameChange}
							type="text"
							name="username"
							id="username"
						/>
						<br />
						<label htmlFor="name">Name</label>
						<input
							onChange={this.onNameChange}
							type="text"
							name="name"
							id="name"
						/>
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
						<input
							onClick={this.onSubmitSignUp}
							type="submit"
							value="Sign Up!"
						/>
					</>
				)}
			</>
		);
	}
}

export default Signup;
