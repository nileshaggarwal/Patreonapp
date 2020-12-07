const express = require("express");
const router = express.Router();
const { uploadController } = require("../controllers/fonts");
const path = require("path");
const { createCategory, addLogos } = require("../controllers/category");

const home = (req, res) => {
	return res.sendFile(path.join(`${__dirname}/../views/index.html`));
};

router.post("/category", createCategory);
router.post("/logos", addLogos);
router.get("/files", home);
router.post("/upload", uploadController.uploadFiles);

module.exports = router;
