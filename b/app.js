require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
var session = require("express-session");

//My routes
const userRoutes = require("./routes/User");
const fileRoutes = require("./routes/fonts");

mongoose
	.connect(process.env.DATABASE, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	})
	.then(() => {
		console.log("DB CONNECTED");
	});

//Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(
	session({
		secret: "keyboard cat",
		resave: false,
		saveUninitialized: true,
		cookie: { secure: true },
	})
);

//My Routes
app.use("/", userRoutes);
app.use("/", fileRoutes);

//Port
const port = process.env.PORT || 2020;

//Starting a server
app.listen(port, () => {
	console.log(`app is running at ${port}`);
});
