const profile = {
	galleryOpened: false
};

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
		main: selectors.profile.find('.gallery'),
		button: selectors.profile.find('.gallery_toggle_button')
	};
	selectors.gallery.photos = selectors.gallery.main.find('.photos');
	selectors.userInfo = selectors.profile.find('.user_info');
};

profile.updateProfilePhoto = function updateProfilePhoto() {
	const profilePhoto = this.userInfo.photos[0];

	this.selectors.photo.css('background', `url('${profilePhoto.photoSmall}')`);
};

profile.setUserInfo = function setUserInfo(userInfo) {
	this.userInfo = userInfo;
};

profile.setPhotos = function setPhotos() {
	const { photos, gender } = this.userInfo;
	this.userInfo.photos = photos.length ? 
		photos:
		[{
			photoSmall: this.defaultPhoto[gender - 1],
			isDefault: true
		}];
	this.updateProfilePhoto();

	if (!this.hasAnyPhoto()) {
		this.renderNoPhotos();
	}

	console.log('setPhotos', this.userInfo.photos, {
		hasAnyPhoto: this.hasAnyPhoto()
	});
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
	this.userInfo.photos = [
		response,
		...this.userInfo.photos
	];
};

profile.uploadPhoto = function uploadPhoto() {
	const iconHtml = '<i class="fas fa-plus-square"></i>';
	const { file } = this.selectors.upload;

	this.updateUploadButton(`${iconHtml} Загрузка...`, true);
	files.upload(file.selector, true)
		.then(response => 
			user.addPhoto(response)
		)
		.then(response => {
			this.addPhoto(response);
			this.renderGalleryPhotos();
			this.updateUploadButton(`${iconHtml} Загрузить`);
			this.setPhotos();
		})
		.catch(err =>
			console.error('uploadPhoto', err)	
		);
};

profile.cleanGalleryPhotos = function cleanGalleryPhotos() {
	const { photos } = this.selectors.gallery;

	photos.html('');
};

profile.renderGalleryPhotos = function renderGalleryPhotos() {
	if (!this.hasAnyPhoto()) {
		return;
	}

	this.cleanGalleryPhotos();

	const { photos } = this.userInfo;
	
	photos.map(this.renderGalleryPhoto.bind(this));
};

profile.renderGalleryPhoto = function renderGalleryPhoto({ id, photo, isDefault }, append = true) {
	if (isDefault) {
		return;
	}

	const { photos } = this.selectors.gallery;
	const photoTpl = `
		<div class="photo" style="background: url('${photo}');" data-id="${id}">
			<div class="controls">
				<i class="far fa-trash-alt" onclick="profile.deletePhoto(${id});"></i>
				<i class="fas fa-eye" onclick="profile.viewPhoto(${id});"></i>
			</div>
		</div>
	`;

	photos[append ?
		'append':
		'prepend'
	]( $( photoTpl ) );
};

profile.renderNoPhotos = function renderNoPhotos() {
	const { photos } = this.selectors.gallery;

	photos.html(`
		<div class="empty">
			<div class="poster"></div>
			<div class="descr">Вы еще не добавили ни одной фотографии :(</div>
		</div>
	`);
};

profile.getPhotoById = function getPhotoById(id) {
	const { photos } = this.userInfo;

	return photos.filter(({ id: photoId }) =>
		photoId === id
	)[0];
};

profile.updateGalleryButton = function updateGalleryButton() {
	const { galleryOpened } = this;
	const { button } = this.selectors.gallery;

	button[galleryOpened ?
		'addClass':
		'removeClass'
	]('gallery_shown');
};

profile.toggleGallery = function toggleGallery() {
	this.galleryOpened = !this.galleryOpened;
	this.updateGalleryButton();

	if (this.galleryOpened) {
		this.openGallery();
		this.hideUserInfo();
	} else {
		this.hideGallery();
		this.showUserInfo();
	}
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

profile.showUserInfo = function showUserInfo() {
	const { userInfo } = this.selectors;

	userInfo.removeClass('none');
	return animate(userInfo, 'bounceInUp');
};

profile.hideUserInfo = function hideUserInfo() {
	const { userInfo } = this.selectors;

	return animate(userInfo, 'bounceOutDown')
		.then(() =>
			userInfo.addClass('none')
		);
};

profile.viewPhoto = function viewPhoto(id) {
	const photo = this.getPhotoById(id);

	if (typeof photo === 'undefined') {
		return;
	}

	window.open(photo.photoOrig);
};

profile.deletePhoto = function deletePhoto(id) {
	return user.deletePhoto(id)
		.then(isDeleted => {
			if (!isDeleted) {
				return false;
			}

			return this.removePhoto(id);
		})
		.then(isDeleted =>
			this.setPhotos()
		);
};

profile.hasAnyPhoto = function hasAnyPhoto() {
	const { photos } = this.userInfo;

	return photos.length && !photos[0].isDefault;
};

profile.removePhoto = function removePhoto(id) {
	const { photos } = this.selectors.gallery;
	const photoSelector = photos
		.find(`.photo[data-id='${id}']`);

	this.ejectPhoto(id);

	return animate(photoSelector, 'flipOutY')
		.then(() =>
			photoSelector.remove()
		);
}; 

profile.ejectPhoto = function ejectPhoto(id) {
	this.userInfo.photos = this.userInfo.photos.filter(({ id: photoId }) =>
		id !== photoId
	)
};

$(document).ready(() => {
	profile.initSelectors();
});