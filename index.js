import cors from 'cors';
import express from 'express';
import fs from 'fs';
import mongoose from 'mongoose';
import multer from "multer";
// controllers
import { create, getAll, getLastTags, getOne, remove, update } from './controllers/PostController.js';
import { getMe, login, register } from './controllers/UserController.js';
// utils
import { checkAuth, handleValidationErrors } from './utils/index.js';
// validate
import { loginValidation, postValidation, registerValidation } from './validations/index.js';
//
//
//
//
//
//
//
// підключення до бази данних mongodb через бібліотеку mongoose:
mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGODB_URI)
	.then(() => console.log('ok'))
	.catch((err) => console.log(err));

// validate
const app = express();

// image storage
const storage = multer.diskStorage({ //шлях до сховища зображнень
	destination: (_, __, cb) => {
		if (!fs.existsSync('uploads')) {
			fs.mkdirSync('uploads'),
		}
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })
app.use(express.json());
app.use(cors()) //виправлення запросів
app.use('/uploads', express.static('uploads'))
//
//
//
//
//
//
app.post('/upload', checkAuth, upload.single('image'), (request, response) => {
	response.json({
		url: `/uploads/${request.file.originalname}`,
	});
})

app.get('/tags', getLastTags); //	отримую теги

app.post('/auth/login', loginValidation, handleValidationErrors, login); // авторизація
app.post('/auth/register', registerValidation, handleValidationErrors, register); // реєстрація
app.get('/auth/me', checkAuth, getMe); // про себе

app.get('/posts', getAll); //	отримую всіх користувачів
app.get('/posts/tags', getLastTags); //	отримую теги
app.get('/posts/:id', getOne); // одну
app.post('/posts', checkAuth, postValidation, handleValidationErrors, create); // створюю статтю
app.delete('/posts/:id', checkAuth, remove); //захищенне через токін видалення
app.patch('/posts/:id', postValidation, checkAuth, handleValidationErrors, update); // оновлення статті
//
//
//
//
//
app.listen(process.env.PORT || 7777, (err) => {
	if (err) {
		console.log('Error:', err);
	} else {
		console.log('Server is OK!');
	}
});