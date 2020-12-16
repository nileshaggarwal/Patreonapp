const express = require("express");
const router = express.Router();
const { createCategory, addLogos } = require("../controllers/category");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

router.post("/category", createCategory);
router.post("/font", upload.array("fonts", 10), addLogos);

module.exports = router;
