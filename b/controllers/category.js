const Category = require("../models/category");
const Font = require("../models/fonts");
const { validationResult } = require("express-validator");
const fs = require("fs");

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

exports.addLogos = (req, res, next) => {
	const font = new Font(req.body);
	console.log(req.files.length);
	for (i = 0; i < req.files.length; i++) {
		font.fonts.data = fs.readFileSync(req.files.path);
		font.fonts.contentType = req.files.type;
	}

	font.save((err, font) => {
		if (err) {
			console.log(err);
			res.status(400).json({
				error: "Error saving in db",
			});
		}
		res.json(font);
	});
};
