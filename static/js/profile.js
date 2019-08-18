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
		...this.photos,
		response
	];
};

profile.uploadPhoto = function uploadPhoto() {
	const { file } = this.selectors.upload;

	this.updateUploadButton('Загрузка...', true);
	files.upload(file.selector, true)
		.then(response => {
			this.addPhoto(response);

			return user.addPhoto(response);
		})
		.then(photoId => {
			this.updateUploadButton('Загрузить ещё');
			this.updateProfilePhoto();
		});
};

$(document).ready(() => {
	profile.initSelectors();
});