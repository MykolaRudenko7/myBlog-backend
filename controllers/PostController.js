import PostModel from '../models/Post.js';
//
//
//
//
//
// отримую всі статті
export const getAll = async (request, response) => {
	try {
		const posts = await PostModel.find().populate('user').exec(); // зв'язок
		response.json(posts);
	} catch (error) {
		console.log('Error:', error);
		response.status(500).json({
			message: 'Не вдалося  отримати статті'
		})
	}
};

// отримую одну сттатю
export const getOne = async (request, response) => {
	try {
		const postId = request.params.id;

		PostModel.findOneAndUpdate( // знайди і обнови 1 статтю
			{
				_id: postId, 					// знахожу по параметрам:  1-id
			},
			{
				$inc: { viewsCount: 1 }, 	// що хочу обновить (к-сть переглядів)
			},
			{
				returnDocument: 'after'   // хочу обновить і оновлений рез повертаю
			},
			(error, document) => {			// ф-ція коли в-ться отрим і оновл, що робити далі
				if (error) {
					console.log('Error:', error);
					return response.status(500).json({
						message: 'Не вдалося  отримати статті'
					});
				}
				if (!document) {					// якщо доку немає
					return response.status(404).json({
						message: 'Статтю не знайдено'
					})
				}

				response.json(document) // якщо все ок даю док
			},
		);
	} catch (error) {
		console.log('Error:', error);
		response.status(500).json({
			message: 'Не вдалося  отримати статті'
		});
	}
};

// видаляю статтю
export const remove = async (request, response) => {
	try {
		const postId = request.params.id;

		PostModel.findOneAndRemove(
			{
				_id: postId,
			},
			(error, document) => {			// ф-ція коли в-ться отрим і оновл, що робити далі
				if (error) {
					console.log('Error:', error);
					return response.status(500).json({
						message: 'Не вдалося видалити статтю'
					});
				}
				if (!document) {					// якщо доку немає
					return response.status(404).json({
						message: 'Статтю не знайдено'
					})
				}

				response.json({
					success: true,
				}) // якщо все ок даю док
			},
		);
	} catch (error) {
		console.log('Error:', error);
		response.status(500).json({
			message: 'Не вдалося  отримати статті'
		});
	}
};

// створюю статті
export const create = async (request, response) => {
	try {
		const document = new PostModel({
			title: request.body.title,
			text: request.body.text,
			tags: request.body.tags,
			imageUrl: request.body.imageUrl,
			user: request.userId
		})

		const post = await document.save();

		response.json(post)

	} catch (error) {
		console.log('Error:', error);
		response.status(500).json({
			message: 'Не вдалося створити статтю'
		})
	}
}

// оновлюю
export const update = async (request, response) => {
	try {
		const postId = request.params.id;
		await PostModel.updateOne(
			{
				_id: postId,
			},
			{
				title: request.body.title,
				text: request.body.text,
				tags: request.body.tags,
				imageUrl: request.body.imageUrl,
				user: request.userId
			})

		response.json({
			success: true,
		})
	} catch (error) {
		console.log('Error:', error);
		response.status(500).json({
			message: 'Не вдалося оновити статтю'
		})
	}
}