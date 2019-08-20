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
	selectors.gallery = selectors.profile.find('');
};

profile.updateProfilePhoto = function updateProfilePhoto() {
	const profilePhoto = this.photos[0];

	this.selectors.photo.css('background', `url('${profilePhoto.photoSmall}')`);
};

profile.setPhotos = function setPhotos({ photos, gender }) {
	this.photos = photos.length ? 
		photos:
		[{
			photoSmall: this.defaultPhoto[gender - 1]
		}];
	this.updateProfilePhoto();

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

profile.updateUploadButton = function updateUploadButton(text, locked = false) {
	this.selectors.upload.button
		.html(text)
		[locked ?
			'addClass':
			'removeClass'
		]('locked');
};

profile.addPhoto = function addPhoto(response) {
	this.photos = [
		response,
		...this.photos
	];
};

profile.uploadPhoto = function uploadPhoto() {
	const iconHtml = '<i class="fas fa-plus-square"></i>';
	const { file } = this.selectors.upload;

	this.updateUploadButton(`${iconHtml} Загрузка...`, true);
	files.upload(file.selector, true)
		.then(response => {
			this.addPhoto(response);

			return user.addPhoto(response);
		})
		.then(photoId => {
			this.updateUploadButton(`${iconHtml} Загрузить`);
			this.updateProfilePhoto();
		});
};

profile.renderGalleryPhotos = function renderGalleryPhotos() {
	const { photos } = this;

	photos.map(this.renderGalleryPhoto.bind(this));
};

profile.renderGalleryPhoto = function renderGalleryPhoto(photo) {
	const { photos } = this;

	console.log('renderGalleryPhoto', photo);
};

profile.openGallery = function openGallery() {
	const { gallery } = this.selectors;

	return animate(gallery, 'bounceInLeft');
};

profile.hideGallery = function hideGallery() {
	const { gallery } = this.selectors;

	return animate(gallery, 'bounceOutRight');
};

$(document).ready(() => {
	profile.initSelectors();
	profile.renderGalleryPhotos();
});