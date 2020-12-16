const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const fontSchema = new mongoose.Schema(
	{
		category: {
			type: ObjectId,
			ref: "Category",
		},
		fonts: [
			{
				data: Buffer,
				contentType: String,
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Fonts", fontSchema);
