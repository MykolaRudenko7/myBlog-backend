import express from 'express';
import mongoose from 'mongoose';
import multer from "multer";
// controllers
import { create, getAll, getOne, remove, update } from './controllers/PostController.js';
import { getMe, login, register } from './controllers/UserController.js';
// utils
import {checkAuth, handleValidationErrors} from './utils/index.js';
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
mongoose.connect('mongodb+srv://admin:1NDE2g12ywyaA1ru@cluster0.pk4kpqd.mongodb.net/blog?retryWrites=true&w=majority',)
	.then(() => console.log('ok'))
	.catch((err) => console.log(err));

// validate
const app = express();

// image storage
const storage = multer.diskStorage({ //шлях до сховища зображнень
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	},
})

const upload = multer({ storage })
app.use(express.json());
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

app.post('/auth/login', loginValidation, handleValidationErrors, login); // авторизація
app.post('/auth/register', registerValidation, handleValidationErrors, register); // реєстрація
app.get('/auth/me', checkAuth, getMe); // про себе

app.get('/posts', getAll); //	отримую всіх користувачів
app.get('/posts/:id', getOne); // одну
app.post('/posts', checkAuth, postValidation, handleValidationErrors, create); // створюю статтю
app.delete('/posts/:id', checkAuth, remove); //захищенне через токін видалення
app.patch('/posts/:id', postValidation, checkAuth, handleValidationErrors, update); // оновлення статті
//
//
//
//
//
app.listen(7777, (err) => {
	if (err) {
		console.log('Error:', err);
	} else {
		console.log('Server is OK!');
	}
});