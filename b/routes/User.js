const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const {
	signup,
	signin,
	signout,
	confirmationPost,
} = require("../controllers/User");

const { savePatreons } = require("../controllers/patreonSubs");
const {
	loginButtonClicked,
	handleOAuthRedirectRequest,
} = require("../controllers/patreonUserData");

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

router.get("/signout", signout);

//Token
router.get("/confirmation", confirmationPost);
//router.post("/resend", resendTokenPost);

router.get("/getPatrons", savePatreons);

router.get("/patreon-link", loginButtonClicked);

router.get("/oauth/redirect", handleOAuthRedirectRequest);

module.exports = router;
