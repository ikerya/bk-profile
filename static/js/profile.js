const profile = {};

profile.initSelectors = function initSelectors() {
	const selectors = this.selectors = {};
	
	selectors.profile = $('.profile');
	selectors.photo = selectors.profile.find('.photo');
};

profile.setPhotos = function setPhotos(photos) {
	this.photos = photos;
	console.log('setPhotos', photos);
};

$(document).ready(() => {
	profile.initSelectors();
});