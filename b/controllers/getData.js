var patreon = require("patreon");
var patreonAPI = patreon.patreon;
const User = require("../models/user");

exports.getData = (req, res) => {
	User.findOne({ _id: req.userID }, (er, user) => {
		if (user.patreon_refresh_token === "Not linked") {
			res.json({ isLinked: false, tier: null });
			return;
		}
		fetch(
			`https://www.patreon.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${user.patreon_refresh_token}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
			{ method: "POST" }
		)
			.then((toke) => toke.json())
			.then((tokens) => {
				if (
					tokens.refresh_token !== user.patreon_refresh_token &&
					tokens.refresh_token != undefined
				) {
					user.patreon_refresh_token = tokens.refresh_token;
					user.save().catch((e) => console.log("Error while saving user- ", e));
				}
				var patreonAPIClient = patreonAPI(tokens.access_token);
				patreonAPIClient("/current_user")
					.then(function (result) {
						const { rawJson } = result;
						const user_id = rawJson.data.id;
						// const user_email = rawJson.data.attributes.email;
						// const user_name = rawJson.data.attributes.full_name;
						fetch(`http://localhost:2020/getPatrons`)
							.then((r) => r.json())
							.then((allPatrons) => {
								if (
									allPatrons
										.map((p) => parseInt(p.user_id))
										.includes(parseInt(user_id))
								) {
									const tier = allPatrons
										.map((p) => {
											if (p.user_id == user_id) return p.tier;
										})
										.filter((element) => element !== undefined)[0];
									res.json({ isLinked: true, tier });
								} else res.json({ isLinked: true, tier: null });
							});
					})
					.catch((e) => {
						user.patreon_refresh_token = "Not linked";
						user
							.save()
							.catch((e) => console.log("Error while saving user- ", e));
						console.log(
							`Error getting tokens from patreon for ${user.name} (${user.email}). Account unlinked.`
						);
						res.json({
							isLinked: false,
							error: `Error authenticating data with Patreon.com, please link your account again.`,
							tier: null,
						});
					});
			});
	});
};
