const User = require("../models/user");
const { validationResult } = require("express-validator");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const TokenS = require("../models/Token");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "2gi19cs140@students.git.edu",
		pass: "hupfwsmwznwchtsf",
	},
});

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

	bcrypt.hash(pass, 8, (err, hash) => {
		const user = new User({
			name: name,
			email: email,
			password: hash,
		});

		user.save((er, u) => {
			if (er) {
				return res.status(400).json({
					err: "NOT able to save user in DB",
				});
			}
			console.log(`New user ${u.email} created.`);
			const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
				expiresIn: "18h",
			});
			res.json({ token, user });
			sendMail(u);
		});
	});
};

const sendMail = (user) => {
	var mailOptions = {
		from: "shreyxs@gmail.com",
		to: user.email,
		subject: "Account Verification Token",
		text:
			`Hello ${user.name},\n\n` +
			"Please verify your account by clicking the link: \nhttp://" +
			"localhost:2020" +
			"/confirmation?token=" +
			createToken(user.id) +
			"\n",
	};
	transporter.sendMail(mailOptions, function (err, msg) {
		if (err) {
			console.log("send mail error -", err.message);
		} else {
			console.log(`sent email to ${user.email} sucessfully.`);
		}
	});
};

const createToken = (userID) => {
	const tokenS = new TokenS({
		userId: userID,
		token: crypto.randomBytes(16).toString("hex"),
	});
	tokenS.save((err, response) => {
		if (err) {
			console.log("unable to save token in db.");
			return;
		}
	});
	return tokenS.token;
};

exports.confirmationPost = (req, res, next) => {
	const errors = validationResult(req);
	const { token } = req.query;
	if (!errors.isEmpty()) {
		return res.status(422).json({
			error: errors.array()[0].msg,
		});
	}
	TokenS.findOne({ token }, function (err, token) {
		if (!token)
			return res.status(400).send({
				type: "not-verified",
				msg:
					"We were unable to find a valid token. Your token my have expired.",
			});

		// If we found a token, find a matching user
		User.findOne({ _id: token.userId }, function (e, user) {
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
			console.log(`${user.name} - Verified.`);
			user.save(function (err) {
				if (err) {
					return res.status(500).send({ error: err.message });
				}
				res.status(200).send("The account has been verified. Please log in.");
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
			if (er) {
				console.log(er);
				res.json({
					error: "Email and password do not match",
				});
			}
			if (!result) {
				res.status(401).json({
					error: "Email and password do not match",
				});
				return;
			}

			//create token
			const token = jwt.sign({ _id: user._id }, process.env.SECRET, {
				expiresIn: "18h",
			});

			//send response  to frontend
			return res.json({ token, user });
		});
	});
};
