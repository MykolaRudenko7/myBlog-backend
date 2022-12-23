import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import UserModel from '../models/User.js';
//
//
//
export const register = async (request, response) => {
	try {
		const errors = validationResult(request)
		if (!errors.isEmpty()) {
			return response.status(400).json(errors.array()) // відповідь - помилка
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
		response.json({
			...userData,
			token,
		});

		// при помилці
	} catch (error) {
		console.log('Error:', error);
		response.status(500).json({ message: 'Не вдалося зареєструватися' })
	}
}
//
//
//
export const login = async (request, response) => {
	try {
		const user = await UserModel.findOne({ email: request.body.email }) // траба дізнатись чи є він у базі данних

		if (!user) { 										// якщо такого киристувача не було знайдено
			return response.status(404).json({ 		// цього не требф уточнювати :)
				message: 'Користувача не знайдено',
			});
		}
		// якщо користувач є у базі, зрівнюю його пароль з бази данних з тим, який він прислав
		const isValidPass = await bcrypt.compare(request.body.password, user._doc.passwordHash) // 1 тіло запросу, 2 в базі

		if (!isValidPass) { 								// якщо не сходяться
			return response.status(400).json({
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
		response.json({
			...userData,
			token,
		});

	} catch (error) {
		console.log('Error:', error);
		response.status(500).json({
			message: 'Не вдалося авторизуватись',
		})
	}
}
//
//
//
export const getMe = async (request, response) => {
	try {
		const user = await UserModel.findById(request.userId)

		if (!user) {
			return response.status(404).json({
				message: 'Користувача не знайдено'
			})
		}

		// дістаю необхідне
		const { passwordHash, ...userData } = user._doc;

		// в-дь серверу, що все успішно
		response.json(userData);

	} catch (error) {
		console.log('Error:', error);
		response.status(500).json({ message: 'Немає доступу' })
	}
}