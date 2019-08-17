class User {
	constructor(accessToken) {
		this.accessToken = accessToken;
	}	

	get() {
		return api.call('/user/');
	}

	static get(id) {
		return api.call(`/user/${id}`);
	}
}