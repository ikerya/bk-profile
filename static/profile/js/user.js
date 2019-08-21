class User {
	constructor(accessToken) {
		this.accessToken = accessToken;
	}	

	get() {
		return api.call('user/');
	}

	addPhoto(response) {
		return this.get()
			.then(({ id }) =>
				api.call(`user/${id}/photos/add`, response, 'POST')
			)
			.then(id => ({
				id,
				...response
			}));
	}

	deletePhoto(photoId) {
		return this.get()
			.then(({ id }) =>
				api.call(`user/${id}/photos/delete/${photoId}`)
			);
	}

	static get(id) {
		return api.call(`user/${id}/`);
	}
}