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
	selectors.gallery = {
		main: selectors.profile.find('.gallery')
	};
	selectors.gallery.photos = selectors.gallery.main.find('.photos');
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

profile.renderGalleryPhoto = function renderGalleryPhoto({ id, photo }, index) {
	const { photos } = this.selectors.gallery;
	const photoTpl = `
		<div class="photo" style="background: url('${photo}');">
			<div class="controls">
				<i class="far fa-trash-alt" onclick="profile.deletePhoto(${id});"></i>
				<i class="fas fa-eye" onclick="profile.viewPhoto(${index});"></i>
			</div>
		</div>
	`;

	photos.append( $( photoTpl ) );
};

profile.openGallery = function openGallery() {
	const { main: gallery } = this.selectors.gallery;

	gallery.removeClass('none');
	return animate(gallery, 'bounceInDown');
};

profile.hideGallery = function hideGallery() {
	const { main: gallery } = this.selectors.gallery;

	return animate(gallery, 'bounceOutUp')
		.then(() =>
			gallery.addClass('none')
		);
};

profile.viewPhoto = function viewPhoto(index) {
	const { photos } = this;
	const photo = photos[index];

	if (typeof photo === 'undefined') {
		return;
	}

	window.open(photo.photoOrig);
};

profile.deletePhoto = function deletePhoto(id) {
	return user.deletePhoto(id)
		.then(response => {
			console.log('deletePhoto', response);

			return response;
		});
};

$(document).ready(() => {
	profile.initSelectors();
});