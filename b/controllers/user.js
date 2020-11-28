const User = require("../models/User");
const { body, validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
var expressJwt = require("express-jwt");
const bcrypt = require("bcrypt");
const user = require("../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const TokenS = require("../models/Token");

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
	const tokenS = new TokenS({
		userId: user._id,
		token: crypto.randomBytes(16).toString("hex"),
	});
	console.log(tokenS);
	tokenS.save((err, response) => {
		if (err) {
			res.status(422).json({
				err: "NOT able to save token",
			});
		}
		res.json(response);
	});

	var transporter = nodemailer.createTransport({
		service: "Sendgrid",
		auth: {
			user: process.env.SENDGRID_USERNAME,
			pass: process.env.SENDGRID_PASSWORD,
		},
	});
	console.log(TokenS.token);
	var mailOptions = {
		from: "shreyxs@gmail.com",
		to: user.email,
		subject: "Account Verification Token",
		text:
			"Hello,\n\n" +
			"Please verify your account by clicking the link: \nhttp://" +
			"localhost:2020" +
			"/confirmation/" +
			TokenS.token +
			".\n",
	};
	transporter.sendMail(mailOptions, function (err) {
		if (err) {
			return res.status(500).send({ msg: err.message });
		}
		res
			.status(200)
			.send("A verification email has been sent to " + user.email + ".");
	});
};

exports.confirmationPost = (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}
	TokenS.findOne({ token: req.body.token }, function (err, token) {
		if (!token)
			return res.status(400).send({
				type: "not-verified",
				msg:
					"We were unable to find a valid token. Your token my have expired.",
			});

		// If we found a token, find a matching user
		User.findOne(
			{ _id: token._userId, email: req.body.email },
			function (err, user) {
				if (!user)
					return res
						.status(400)
						.send({ msg: "We were unable to find a user for this token." });
				if (user.isVerified)
					return res.status(400).send({
						type: "already-verified",
						msg: "This user has already been verified.",
					});

				// Verify and save the user
				user.isVerified = true;
				user.save(function (err) {
					if (err) {
						return res.status(500).send({ msg: err.message });
					}
					res.status(200).send("The account has been verified. Please log in.");
				});
			}
		);
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
