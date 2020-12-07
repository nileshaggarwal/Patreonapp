var url = require("url");
var patreon = require("patreon");
var patreonOAuth = patreon.oauth;
const User = require("../models/user");

var patreonOAuthClient = patreonOAuth(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET
);

var redirectURL = "http://localhost:2020/oauth/redirect";

exports.handleOAuthRedirectRequest = (request, response) => {
	var oauthGrantCode = url.parse(request.url, true).query.code;
	var loggedInAs = url.parse(request.url, true).query.state;
	User.findOne({ _id: loggedInAs }, (er, user) => {
		patreonOAuthClient
			.getTokens(oauthGrantCode, redirectURL)
			.then(function (tokensResponse) {
				user.patreon_refresh_token = tokensResponse.refresh_token;
				response.redirect(`http://localhost:3000`);
				user.save();
			});
	});
};

exports.loginButtonClicked = (req, res) => {
	res.json(
		`https://www.patreon.com/oauth2/authorize?response_type=code&client_id=${process.env.CLIENT_ID}&redirect_uri=${redirectURL}&state=${req.userID}`
	);
};
