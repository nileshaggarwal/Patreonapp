const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
var jwt = require("jsonwebtoken");
const User = require("../models/user");

const verifyJWT = (req, res, next) => {
	const token = req.headers["x-access-token"];
	if (!token) res.send("not authenticated");
	else
		jwt.verify(token, process.env.SECRET, (er, decoded) => {
			if (er) {
				res.json({
					error: "Not authenticated",
				});
				return;
			} else
				User.findOne({ _id: decoded._id }, (err, user) => {
					if (err || !user) {
						res.json({
							error: "Failed to authenticate token.",
						});
						return;
					} else req.userID = decoded._id;
				});
			next();
		});
};

const { signup, signin, confirmationPost } = require("../controllers/User");

const { getData } = require("../controllers/getData");

const { savePatreons } = require("../controllers/allPatrons");

const { unlink } = require("../controllers/unlink");

const {
	loginButtonClicked,
	handleOAuthRedirectRequest,
} = require("../controllers/linkPatreon");

router.post(
	"/signup",
	[
		check("name", "Name should be atleast 3 char long").isLength({ min: 3 }),
		check("email", "Email is required").isEmail(),
		check("password", "Password should be atleast 5 char long").isLength({
			min: 5,
		}),
	],
	signup
);

router.post(
	"/signin",
	[
		check("email", "Email is required").isEmail(),
		check("password", "Password field is required").isLength({ min: 1 }),
	],
	signin
);

router.get("/confirmation", confirmationPost);
//router.post("/resend", resendTokenPost);

router.get("/getPatrons", savePatreons);

router.get("/getData", verifyJWT, getData);

router.get("/patreon-link", verifyJWT, loginButtonClicked);

router.get("/oauth/redirect", handleOAuthRedirectRequest);

router.get("/getTier", verifyJWT, (req, res) => res.json(req.app.locals.tier));

router.get("/unlink", verifyJWT, unlink);

module.exports = router;
