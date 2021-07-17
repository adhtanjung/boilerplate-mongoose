const db = require("../models");
const argon2 = require("argon2");
const User = db.users;

exports.findAll = async (req, res) => {
	try {
		const result = await User.find();
		return res.status(200).send(result);
	} catch (err) {
		return res.status(500).send({
			message: err.message || "Something went wrong when retrieving users data",
		});
	}
};

exports.create = async (req, res) => {
	const { username, name, password, email } = req.body;
	try {
		const userEmailDupe = await User.findOne({ email });
		const userUsernameDupe = await User.findOne({ username });
		if (userEmailDupe) {
			return res.status(400).send({
				message: "Email already taken",
			});
		}
		if (userUsernameDupe) {
			return res.status(400).send({
				message: "Username already taken",
			});
		}

		const user = new User({
			username,
			name,
			password: await argon2.hash(password),
			email,
		});
		const result = await user.save(user);
		return res.status(201).send(result);
	} catch (error) {
		return res.status(404).send({
			message: error.message || "Couldn't create user ",
		});
	}
};

exports.update = async (req, res) => {
	const { id } = req.params;
	const body = req.body;
	try {
		const result = await User.findByIdAndUpdate(id, body);

		return res.status(200).send({ data: result, message: "User updated" });
	} catch (err) {
		return res.status(404).send({ message: err.message || "User not found " });
	}
};

exports.updatePassword = async (req, res) => {
	const { id } = req.params;
	const { newPassword, oldPassword } = req.body;
	try {
		const findUser = await User.findById(id);
		if (!findUser) {
			return res.status(404).send({
				message: "User not found",
			});
		}
		const { password } = findUser;
		const isValid = await argon2.verify(password, oldPassword);
		if (!isValid) {
			return res.status(404).send({
				message: "Wrong password",
			});
		}
		await User.findByIdAndUpdate(id, {
			password: await argon2.hash(newPassword),
		});
		res.status(200).send({
			message: "Password changed",
		});
	} catch (err) {
		return res.status(404).send({ message: err.message || "User not found " });
	}
};
exports.delete = async (req, res) => {
	const { id } = req.params;
	try {
		const result = await User.findByIdAndRemove(id);
		console.log("RESULT:", result);
		if (!result) {
			return res.status(404).send({
				message: "User not found",
			});
		}
		return res.status(200).send({ message: "User deleted" });
	} catch (err) {
		return res.status(404).send({
			message: err.message || "User Not Found",
		});
	}
};
