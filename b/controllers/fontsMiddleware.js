const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

var storage = new GridFsStorage({
	url: process.env.DATABASE,

	options: { useNewUrlParser: true, useUnifiedTopology: true },
	file: (req, file) => {
		const match = ["image/png", "image/jpeg"];

		if (match.indexOf(file.mimetype) === -1) {
			const filename = `${file.originalname}`;
			return filename;
		}

		return {
			bucketName: "photos",
			filename: `${file.originalname}`,
		};
	},
});

var uploadFiles = multer({ storage: storage }).array("multi-files", 10);
var uploadFilesMiddleware = util.promisify(uploadFiles);
module.exports = uploadFilesMiddleware;
