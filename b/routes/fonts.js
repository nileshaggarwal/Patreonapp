const express = require("express");
const router = express.Router();
const uploadController = require("../controllers/fonts");
const path = require("path");

const home = (req, res) => {
	return res.sendFile(path.join(`${__dirname}/../views/index.html`));
};

router.get("/files", home);
router.post("/upload", uploadController.uploadFiles);

module.exports = router;
