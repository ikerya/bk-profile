const profile = {};

profile.defaultPhoto = [
	'/profile/images/boy.svg',
	'/profile/images/girl.svg'
];

profile.initSelectors = function initSelectors() {
	const selectors = this.selectors = {};
	
	selectors.profile = $('.profile');
	selectors.photo = selectors.profile.find('.photo');
	selectors.upload = {
		button: selectors.profile.find('#upload_photo_button'),
		file: selectors.profile.find('#upload_photo_file')
	};
};

profile.setProfilePhoto = function setProfilePhoto() {
	const profilePhotoUrl = this.photos[0];

	this.selectors.photo.css('background', `url('${profilePhotoUrl}')`);
};

profile.setPhotos = function setPhotos({ photos, gender }) {
	this.photos = photos.length ? 
		photos:
		[ this.defaultPhoto[gender - 1] ];
	this.setProfilePhoto();

	console.log('setPhotos', this.photos);
};

profile.initUploadPhotoButton = function initUploadPhotoButton() {
	const { button, file } = this.selectors.upload;

	button.on('click', () =>
		file.click()
	);
	file.on('change', () =>
		profile.uploadPhoto()
	);
};

profile.uploadPhoto = function uploadPhoto() {
	const { file } = this.selectors.upload;
	const photo = file[0].files[0];

	console.log(photo);
};

$(document).ready(() => {
	profile.initSelectors();
});