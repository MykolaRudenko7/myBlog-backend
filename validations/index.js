import { body } from 'express-validator'
//
//
//
//
//
export const loginValidation = [
	body('email', "Невірний формат пошти").isEmail(), 	// check is email
	body('password', "Недостатня кількість символів").isLength({ min: 5 }), // якщо довжина паролю більше 5 символів, то ок
]

export const registerValidation = [
	body('email', "Невірний формат пошти").isEmail(),
	body('password', "Недостатня кількість символів").isLength({ min: 5 }),
	body('fullName', "Вкажіть ім'я").isLength({ min: 5 }),
	body('avatarUrl', "Невірне посилання на аватар").optional().isURL(),
]

export const postValidation = [
	body('title', "Введіть заголовок статті").isLength({ min: 5 }).isString(),
	body('text', "Введіть текст статті").isLength({ min: 10 }).isString(),
	body('tags', "Неправильний формат тегів").optional().isString(),
	body('imageUrl', "Невірне посилання на зображення").optional().isString(),
]