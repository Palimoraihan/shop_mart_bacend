const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../model/user');
const authRoute = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

//Sign up
authRoute.post('/api/signup', async (req, res) => {
	try {
		const { name, email, password } = req.body;
		console.log(name);
		console.log(email);
		console.log(password);
		const existingUser = await User.findOne({
			email,
		});
		if (existingUser) {
			return res.status(400).json({ msg: 'User already use' });
		}
		const hashadPassword = await bcrypt.hash(password, 8);
		let user = new User({
			email,
			password: hashadPassword,
			name,
		});
		user = await user.save();
		res.json(user);
	} catch (e) {
		console.log(e);
		res.status(500).json({ error: e.message });
	}
});

//Sign user
authRoute.post('/api/signin', async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({
			email,
		});
		if (!user) {
			return res.status(400).json({ msg: 'Email Not Existing' });
		}
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ msg: 'Worng Password' });
		}
		const token = jwt.sign({ id: user._id }, 'passwordKey');
		res.json({ token, ...user._doc });
	} catch (error) {
		res.status(500).json({ error: e.message });
	}
});
authRoute.post('/tokenIsValid', async (req, res) => {
	try {
		const token = req.header('x-auth-token');
		if (!token) return res.json(false);
		const verf = jwt.verify(token, 'passwordKey');
		if (!verf) return res.json(false);
		const user = await User.findById(verf.id);
		if (!user) return res.json(false);
		res.json(true);
	} catch (error) {
		res.status(500).json({ error: e.message });
	}
});

authRoute.get('/', auth, async (req, res) => {
	const user = await User.findById(req.user);
	res.json({ ...user._doc, token: req.token });
});

module.exports = authRoute;
