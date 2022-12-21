import { body } from 'express-validator'


export const registerValidation = [
	body('email', "Невірний формат пошти").isEmail(), 	// check is email
	body('password', "Недостатня кількість символів").isLength({ min: 5 }),	 // якщо довжина паролю більше 5 символів, то ок
	body('fullName', "Вкажіть ім'я").isLength({ min: 5 }),
	body('avatarUrl', "Невірне посилання на аватар").optional().isURL(),	// опціонально, але якщо є, то перевір чи це лінк
]