const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 24,
		},
		username: {
			type: String,
			maxlength: 24,
			default: "",
		},
		email: {
			type: String,
			required: true,
			trim: true,
		},
		isVerified: {
			type: Boolean,
			default: false,
		},
		password: {
			type: String,
			required: true,
		},
		profilePic: {
			data: Buffer,
			contentType: String,
		},
		patreon_refresh_token: {
			type: String,
			required: true,
			default: "Not linked",
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
