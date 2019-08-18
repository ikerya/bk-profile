class User {
	constructor(accessToken) {
		this.accessToken = accessToken;
	}	

	get() {
		return api.call('user/');
	}

	addPhoto(response) {
		return api.call(`user/${id}/photos/add`, response, 'POST');
	}

	static get(id) {
		return api.call(`user/${id}/`);
	}
}