const patreon = require("patreon");
const patreonAPI = patreon.patreon;
const patreonAPIClient = patreonAPI(process.env.ACCESS_TOKEN);

exports.savePatreons = (req, res) => {
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
			res.json(patrons);
		})
		.catch(err => {
			console.error("Error fetching pledges:", err);
			res.status(400);
		});
};
