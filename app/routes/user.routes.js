module.exports = (app) => {
	const users = require("../controllers/user.controller");
	const router = require("express").Router();

	router.get("/", users.findAll);
	router.post("/", users.create);
	router.patch("/change-password/:id", users.updatePassword);
	router.delete("/:id", users.delete);
	router.patch("/:id", users.update);

	app.use("/api/users", router);
};
