import mongoose from 'mongoose';


// тут схема з властивостями користувача (якщо передаю об'єкт, то значить це обов'язкове поле)
const UserSchema = new mongoose.Schema(
{
	fullName: {
		type: String,			// 1 - це строка
		required: true,		// 2 - обов'язкова
	},
	email: {
		type: String,
		required: true,
		unique: true,			// + має бути унікальним
	},
	passwordHash: {
		type: String,
		required: true,
	},
	avatarUrl: String
},
{
	// схема автоматично при створ користувача, має дати дату створ. і обновл
	timestamps: true,
});



export default mongoose.model('User', UserSchema)