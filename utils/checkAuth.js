import jwt from 'jsonwebtoken';
//
//
//
//
//
// чи можна повертати якусь інф
export default (request, response, next) => {

	const token = (request.headers.authorization || '').replace(/Bearer\s?/, ''); // беру токін з запиту авторизації

	if (token) {
		try {																		// якщо токен є
			const decodedToken = jwt.verify(token, 'secret123'); // розшифрований токін
			request.userId = decodedToken._id; 							//	вшиваю в запит
			next(); 																//далі
		} catch (error) {
			return response.status(403).json({
				message: 'Немає доступу'
			});
		}
	} else {
		return response.status(403).json({
			message: 'Немає доступу'
		});
	}
};
