const Category = require("../models/category");
const { validationResult } = require("express-validator");

exports.createCategory = (req, res) => {
	const category = new Category(req.body);
	category.save((err, category) => {
		if (err) {
			res.status(400).json({
				error: "NOT able to save category in DB",
			});
		}
		res.json({ category });
	});
};
