const User = require("../models/user");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const bcrypt = require("bcrypt");
const user = require("../models/user");

exports.signup = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	const name = req.body.name;
	const email = req.body.email;
	const pass = req.body.password;
	bcrypt.hash(pass, 10, (err, hash) => {
		const user = new User({
			name: name,
			email: email,
			password: hash,
		});
		user.save((err, user) => {
			if (err) {
				return res.status(400).json({
					err: "NOT able to save user in DB",
				});
			}
			res.json({
				name: user.name,
				email: user.email,
				id: user._id,
			});
		});
	});
};

exports.signin = (req, res) => {
	const errors = validationResult(req);

	const { email, password } = req.body;

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}

	User.findOne({ email }, (err, user) => {
		if (err || !user) {
			return res.status(400).json({
				error: "USER email does not exist",
			});
		}

		bcrypt.compare(password, user.password, function (er, result) {
			if (er) console.log(er);
			if (!result) {
				res.status(401).json({
					error: "Email and password do not match",
				});
			}

			//create token
			const token = jwt.sign({ _id: user._id }, process.env.SECRET);

			//put token in cookie
			res.cookie("token", token, { expire: new Date() + 99 });

			//send response  to frontend
			const { _id, name, email, role } = user;
			return res.json({ token, user: { _id, name, email } });
		});
	});
};

exports.signout = (req, res) => {
	res.clearCookie("token");
	res.json({
		message: "User signout successfully",
	});
};
