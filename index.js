const authRoute = require('./routes/auth');
const express = require('express');
const mongoose = require('mongoose');
const PORT = 3000;
const app = express();
const DB =
	'mongodb+srv://palimo:p12345@cluster0.rlx6fvq.mongodb.net/?retryWrites=true&w=majority';
app.use(express.json());
app.use(authRoute);

mongoose
	.connect(DB)
	.then(() => {
		console.log('Connect DB');
	})
	.catch((e) => {
		console.log(e);
	});

app.listen(PORT, '0.0.0.0', () => {
	console.log(`Connect port ${PORT}`);
});
