const db = require("../models");
const Post = db.posts;

exports.findAll = (req, res) => {
	Post.find()
		.then((result) => {
			res.status(200).send(result);
		})
		.catch((err) => {
			res.status(500).send({
				message: err.message || "Error while retrieving posts.",
			});
		});
};

exports.create = (req, res) => {
	const post = new Post({
		title: req.body.title,
		body: req.body.body,
		published: req.body.published ?? false,
	});

	post
		.save(post)
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			res.status(409).send({
				message: err.message || "Error while create post",
			});
		});
};

exports.findOne = (req, res) => {
	const id = req.params.id;

	Post.findById(id)
		.then((result) => {
			res.send(result);
		})
		.catch((err) => {
			res.status(409).send({
				message: err.message || "Error while showing posts",
			});
		});
};

exports.update = async (req, res) => {
	const { id } = req.params;

	try {
		const result = await Post.findByIdAndUpdate(id, req.body);
		if (!result)
			res.status(404).send({
				message: "Post not found",
			});
		res.status(201).send({
			message: "Post updated",
		});
	} catch (err) {
		res.status(404).send({
			message: err.message || "Error while updating posts",
		});
	}
};

exports.delete = async (req, res) => {
	const { id } = req.params;
	try {
		const result = await Post.findByIdAndRemove(id);
		if (!result) {
			res.status(404).send({
				message: "Post not found",
			});
		}
		res.status(201).send({
			message: "Post deleted",
		});
	} catch (err) {
		res.status(404).send({
			message: err.message || "Error while deleting posts",
		});
	}
};
