const mongoose = require("mongoose");

const tokenStorageSchema = new mongoose.Schema(
	{
		access_token: {
			type: String,
		},
		refresh_token: {
			type: String,
		},
	},
	{ collection: "creator_tokens" }
);

module.exports = mongoose.model("TokenStroage", tokenStorageSchema);
