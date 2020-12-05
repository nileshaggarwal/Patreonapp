const User = require("../models/User");

exports.unlink = (req, res) => {
	User.findOne({ _id: req.userID }, (err, user) => {
		if (err || !user) {
			res.status(400);
			return;
		}
		user.patreon_refresh_token = "Not linked";
		user.save();
		res.json(true);
	});
};
