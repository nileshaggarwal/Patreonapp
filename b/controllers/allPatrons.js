const patreon = require("patreon");
const patreonAPI = patreon.patreon;
const storage = require("../models/tokenStorage");

exports.savePatreons = (req, res) => {
	storage.findOne({}, (e, tok) => {
		if (e) {
			console.log(e);
			return;
		}
		fetch(
			`https://www.patreon.com/api/oauth2/token?grant_type=refresh_token&refresh_token=${tok.refresh_token}&client_id=${process.env.CLIENT_ID}&client_secret=${process.env.CLIENT_SECRET}`,
			{ method: "POST" }
		)
			.then((toke) => toke.json())
			.then((tokens) => {
				const { access_token, refresh_token } = tokens;
				const patreonAPIClient = patreonAPI(access_token);
				var patrons = [];
				patreonAPIClient(
					`/campaigns/${process.env.CAMPAIGN_ID}/pledges?include=patron.null`
				)
					.then(({ store }) => {
						const pledges = store.findAll("pledge");
						for (let i of pledges) {
							const user_id = i.patron.id;
							const user_name = i.patron.full_name;
							const user_email = i.patron.email;
							const tier = i.amount_cents;
							patrons.push({ user_id, tier, user_name, user_email });
						}
						tok.access_token = access_token;
						tok.refresh_token = refresh_token;
						tok.save();
						res.json(patrons);
					})
					.catch((err) => {
						console.error("Error fetching pledges:", err);
						res.status(400);
					});
			})
			.catch((err) => {
				console.error("Error getting access token:", err);
				res.status(400);
			});
	});
};
