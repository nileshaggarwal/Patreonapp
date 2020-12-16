const express = require("express");
const router = express.Router();
const { uploadFiles } = require("../controllers/fonts");
const path = require("path");
const { createCategory, addLogos } = require("../controllers/category");

const home = (req, res) => {
	return res.sendFile(path.join(`${__dirname}/../views/index.html`));
};

router.post("/category", createCategory);

router.get("/files", home);
router.post("/upload", uploadFiles);

module.exports = router;
