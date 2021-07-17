const app = require("express")();
const bodyParser = require("body-parser");
const cors = require("cors");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models/");
db.mongoose
	.connect(db.url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: true,
	})
	.then((result) => {
		console.log("database connected");
	})
	.catch((err) => {
		console.log("cannot conenct to the database", err);
		process.exit();
	});
const PORT = 8000;
app.get("/", (req, res) => {
	res.status(200).send("<center><h1>mongo api</h1></center>");
});
require("./app/routes/post.routes")(app);
require("./app/routes/user.routes")(app);

app.listen(PORT, () => {
	console.log(`Server is running or http://localhost:${PORT}`);
});
