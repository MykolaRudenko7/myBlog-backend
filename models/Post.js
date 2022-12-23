import mongoose from 'mongoose';


// тут схема з властивостями користувача (якщо передаю об'єкт, то значить це обов'язкове поле)
const PostSchema = new mongoose.Schema(
	{
		title: {
			type: String,			// 1 - це строка
			required: true,		// 2 - обов'язкова
		},
		text: {
			type: String,
			required: true,
			unique: true,			// + має бути унікальним
		},
		tags: {
			type: Array,
			default: [],
		},
		viewsCount: {
			type: Number,
			default: 0,
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		imageUrl: String
	},
	{
		// схема автоматично при створ статті, має дати дату створ. і обновл
		timestamps: true,
	});



export default mongoose.model('Post', PostSchema)