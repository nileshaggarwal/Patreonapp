const upload = require("./fontsMiddleware");

const uploadFiles = async (req, res) => {
	try {
		await upload(req, res);

		if (req.files.length <= 0) {
			return res.send(`You must select at least 1 file.`);
		}

		return res.send(`Files have been uploaded.`);
	} catch (error) {
		console.log(error);

		if (error.code === "LIMIT_UNEXPECTED_FILE") {
			return res.send("Too many files to upload.");
		}
		return res.send(`Error when trying upload many files: ${error}`);
	}
};

exports.addLogos = (req, res) => {};

module.exports = {
	uploadFiles: uploadFiles,
};
