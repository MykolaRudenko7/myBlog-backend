import bcrypt from 'bcrypt';
import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
// перевіряє чи є помилка при запросі
import { validationResult } from 'express-validator';

import UserModel from './models/User.js';
import { registerValidation } from './validations/auth.js';
//
//
//
//
//
//
//
//
// підключення до бази данних mongodb через бібліотеку mongoose:
mongoose.connect('mongodb+srv://admin:1NDE2g12ywyaA1ru@cluster0.pk4kpqd.mongodb.net/blog?retryWrites=true&w=majority',)
	.then(() => console.log('ok'))
	.catch((err) => console.log(err));

// validate
const app = express();
app.use(express.json());


// ! авторизація
app.post('/auth/login', async (request, responce) => {
	try {
		const user = await UserModel.findOne({ email: request.body.email }) // траба дізнатись чи є він у базі данних

		if (!user) { 										// якщо такого киристувача не було знайдено
			return responce.status(404).json({ 		// цього не требф уточнювати :)
				message: 'Користувача не знайдено',
			});
		}
		// якщо користувач є у базі, зрівнюю його пароль з бази данних з тим, який він прислав
		const isValidPass = await bcrypt.compare(request.body.password, user._doc.passwordHash) // 1 тіло запросу, 2 в базі

		if (!isValidPass) { 								// якщо не сходяться
			return responce.status(400).json({
				message: 'Невірний логін або пароль',
			})
		}

		// якщо все добре
		// генерую токін
		// jwt token з шарифрованою інформацією
		const token = jwt.sign(
			{
				_id: user._id, // в монгодб ід так пишеться
			},
			'secret123',
			{
				expiresIn: '30d'
			}
		); // 2параметр - ключ, 3й - термін валідності токену

		// дістаю необхідне
		const { passwordHash, ...userData } = user._doc;

		// в-дь серверу, що все успішно
		responce.json({
			...userData,
			token,
		});

	} catch (error) {
		console.log('Error:', error);
		responce.status(500).json({
			message: 'Не вдалося авторизуватись',
		})
	}
});



// ! реєстрація
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
		const hash = await bcrypt.hash(password, salt) // тут тепер зашифрований пароль

		// документ - створ користувача (в конструктор дані з запиту користувача)
		const document = new UserModel({
			email: request.body.email,
			passwordHash: hash,
			fullName: request.body.fullName,
			avatarUrl: request.body.avatarUrl,
		});

		// зберігаю підготовленого користувача в базі данних
		const user = await document.save();

		// jwt token з шарифрованою інформацією
		const token = jwt.sign({
			_id: user._id, // в монгодб ід так пишеться
		}, 'secret123', { expiresIn: '30d' }); // 2параметр - ключ, 3й - термін валідності токену

		// дістаю необхідне
		const { passwordHash, ...userData } = user._doc;

		// в-дь серверу, що все успішно
		responce.json({
			...userData,
			token,
		});

		// при помилці
	} catch (error) {
		console.log('Error:', error);
		responce.status(500).json({ message: 'Не вдалося зареєструватися' })
	}
});



app.get('auth/me', (request, responce) => {
	try {
		
	} catch (error) {

	}
})





app.listen(7777, (err) => {
	if (err) {
		console.log(err);
	} else {
		console.log('OK!');
	}
});