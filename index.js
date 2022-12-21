import bcrypt from 'bcrypt';
import express from 'express';
import mongoose from 'mongoose';
// перевіряє чи є помилка при запросі
import { validationResult } from 'express-validator';

import UserModel from './models/User.js';
import { registerValidation } from './validations/auth.js';



mongoose.connect('mongodb+srv://admin:1NDE2g12ywyaA1ru@cluster0.pk4kpqd.mongodb.net/blog?retryWrites=true&w=majority',)
	.then(() => console.log('ok'))
	.catch((err) => console.log(err));

const app = express();

app.use(express.json());


// якщо прийде запрос, то я перевірю чи є те, що мені потрібно через валідатор
app.post('/auth/register', registerValidation, async (request, responce) => {
	try {
		const errors = validationResult(request)
		if (!errors.isEmpty()) {
			return responce.status(400).json(errors.array()) // відповідь - помилка
		}

		// шифрую пароль
		const password = request.body.password; // тут пароль
		const salt = await bcrypt.genSalt(10); // алгоритм шифрування (бібліотека)
		const passwordHash = await bcrypt.hash(password, salt) // тут тепер зашифрований пароль

		// документ - створ користувача (в конструктор дані з запиту користувача)
		const document = new UserModel({
			email: request.body.email,
			passwordHash,
			fullName: request.body.fullName,
			avatarUrl: request.body.avatarUrl,
		});

		// зберігаю підготовленого користувача в базі данних
		const user = await document.save();

		// в-дь серверу, що все успішно
		responce.json(user);

		// при помилці
	} catch (error) {
		responce.status(500).json({ message: 'Не вдалося зареєструватися' })
		console.log('Error:', error);
	}
});

app.listen(7777, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('OK!');
	}
});