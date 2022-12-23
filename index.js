import express from 'express';
import mongoose from 'mongoose';

import { create, getAll, getOne, remove } from './controllers/PostController.js';
import { getMe, login, register } from './controllers/UserController.js';
import checkAuth from './utils/checkAuth.js';
import { loginValidation, postValidation, registerValidation } from './validations/index.js';
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




app.post('/auth/login', loginValidation, login); // авторизація
app.post('/auth/register', registerValidation, register); // реєстрація
app.get('/auth/me', checkAuth, getMe); // про себе



app.get('/posts', getAll); //отримую всіх користувачів
app.get('/posts/:id', getOne);
app.post('/posts', checkAuth, postValidation, create); // створюю статтю
app.delete('/posts/:id', checkAuth, remove); //захищенне через токін видалення
// app.path('/posts/', PostController.remove);



app.listen(7777, (err) => {
	if (err) {
		console.log('Error:', err);
	} else {
		console.log('Server is OK!');
	}
});