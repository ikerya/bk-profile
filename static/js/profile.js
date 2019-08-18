const profile = {};

profile.defaultPhoto = [
	'/profile/images/boy.svg',
	'/profile/images/girl.svg'
];

profile.initSelectors = function initSelectors() {
	const selectors = this.selectors = {};
	
	selectors.profile = $('.profile');
	selectors.photo = selectors.profile.find('.photo');
};

profile.setPhotos = function setPhotos({ photos, gender }) {
	this.photos = photos.length ? 
		photos:
		this.defaultPhoto[gender - 1];
	console.log('setPhotos', this.photos);
};

$(document).ready(() => {
	profile.initSelectors();
});