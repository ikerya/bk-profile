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

	selectors.userInfo = {
		main: selectors.profile.find('.user_info')
	};
	selectors.userInfo.status = selectors.userInfo.main.find('.status .value');
	selectors.userInfo.points = selectors.userInfo.main.find('.points .value');
	selectors.userInfo.id = selectors.userInfo.main.find('.id .value');
	selectors.userInfo.name = selectors.userInfo.main.find('.name .value');
	selectors.userInfo.gender = selectors.userInfo.main.find('.gender .value');
	selectors.userInfo.email = selectors.userInfo.main.find('.email .value');
	selectors.userInfo.birthdate = selectors.userInfo.main.find('.birthdate .value');
	selectors.userInfo.region = selectors.userInfo.main.find('.region .value');
	selectors.userInfo.refLink = selectors.userInfo.main.find('.ref_link .value');
};

profile.updateProfilePhoto = function updateProfilePhoto() {
	const profilePhoto = this.userInfo.photos[0];

	this.selectors.photo.css('background', `url('${profilePhoto.photoSmall}')`);
};

profile.setUserInfo = function setUserInfo(userInfo) {
	this.userInfo = userInfo;
};

profile.renderStatus = function renderStatus() {
	const { status } = this.userInfo;
	const { status: main } = this.selectors.userInfo;

	main.html(status ?
		status:
		'рекомендатель'
	);
};

profile.renderPoints = function renderPoints() {
	const { points } = this.userInfo;
	const { points: main } = this.selectors.userInfo;

	main.html(points ?
		points:
		'не указано'
	);
};

profile.renderID = function renderID() {
	const { id } = this.userInfo;
	const { id: main } = this.selectors.userInfo;

	main.html(id ?
		id:
		'не указано'
	);
};

profile.renderName = function renderName() {
	const { firstName, lastName } = this.userInfo;
	const { name: main } = this.selectors.userInfo;

	main.html(`${firstName} ${lastName}`);
};

profile.renderGender = function renderGender() {
	const { gender } = this.userInfo;
	const { gender: main } = this.selectors.userInfo;

	main.html(!gender || gender === 2 ?
		'Женский':
		'Мужской'
	);
};

profile.renderEmail = function renderEmail() {
	const { email } = this.userInfo;
	const { email: main } = this.selectors.userInfo;

	main.html(email ?
		email:
		'не указано'
	);
};

profile.renderBirthdate = function renderBirthdate() {
	const { birthday } = this.userInfo;
	const { birthdate: main } = this.selectors.userInfo;

	main.html(birthday ?
		profile.parseBirthdate(birthday):
		'не указано'
	);
};

profile.renderRegion = function renderRegion() {
	const { region } = this.userInfo;
	const { region: main } = this.selectors.userInfo;
	const regionInfo = regions.getByID(region);

	main.html(regionInfo.id ?
		regionInfo.name:
		'не указано'
	);
};

profile.renderRefLink = function renderRefLink() {
	const { id } = this.userInfo;
	const { refLink: main } = this.selectors.userInfo;
	const refLink = `https://${location.host}/ref/${id}/1`;

	main.html(`
		<a href="${refLink}" target="_blank">${refLink}</a>
	`);
};

profile.renderUserInfo = function renderUserInfo() {
	this.renderStatus();
	this.renderPoints();
	this.renderID();
	this.renderName();
	this.renderGender();
	this.renderEmail();
	this.renderBirthdate();
	this.renderRegion();
	this.renderRefLink();
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
		this.hideUserInfo()
			.then(() =>
				this.openGallery()
			);
	} else {
		this.hideGallery()
			.then(() =>
				this.showUserInfo()
			);
	}
};

profile.openGallery = function openGallery() {
	const { main: gallery } = this.selectors.gallery;

	gallery.removeClass('none');
	return animate(gallery, 'fadeInDown');
};

profile.hideGallery = function hideGallery() {
	const { main: gallery } = this.selectors.gallery;

	return animate(gallery, 'fadeOutUp')
		.then(() =>
			gallery.addClass('none')
		);
};

profile.showUserInfo = function showUserInfo() {
	const { main: userInfo } = this.selectors.userInfo;

	userInfo.removeClass('none');
	return animate(userInfo, 'fadeInUp');
};

profile.hideUserInfo = function hideUserInfo() {
	const { main: userInfo } = this.selectors.userInfo;

	return animate(userInfo, 'fadeOutDown')
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

profile.saveName = async function saveName(modal) {
	const result = {
		ok: false
	};
	const { main } = modal.selectors;	
	const firstName = main.find('#first_name');
	const lastName = main.find('#last_name');

	if (!firstName.val()) {
		firstName.focus();

		return result;
	}

	if (!lastName.val()) {
		lastName.focus();

		return result;
	}

	result.ok = true;
	result.firstName = firstName.val();
	result.lastName = lastName.val();

	return result;
};

profile.openNameEditor = function openNameEditor() {
	const { firstName, lastName } = this.userInfo;

	new Modal({
		width: 450,
		opened: true,
		title: 'Редактировать имя',
		body: `
			<div class="user_data_row">
				<input class="user_data_input" placeholder="Введите ваше имя.." value="${firstName}" id="first_name">
			</div>
			<div class="user_data_row">
				<input class="user_data_input" placeholder="Введите вашу фамилию.." value="${lastName}" id="last_name">
			</div>
		`,
		footer: {
			buttons: [{
				text: 'Закрыть',
				action: function() {
					this.remove();
				}
			}, {
				text: 'Сохранить',
				action: function(button) {
					profile.saveName(this)
						.then(({ ok, firstName, lastName }) => {
							if (!ok) {
								return;
							}

							return user.update({
								firstName,
								lastName
							});
						})
						.then(result => {
							if (typeof result === 'undefined') {
								notify.create(250, {
									act: 'error',
									title: 'Ошибка',
									message: 'Пожалуйста, не оставляйте поля пустыми.'
								});

								return;
							}

							if (!result) {
								notify.create(250, {
									act: 'error',
									title: 'Ошибка',
									message: 'Не удалось сохранить данные. Повторите попытку.'
								});

								return;
							}
							
							return user.get();
						})
						.then(userInfo => {
							if (!userInfo || !userInfo.id) {
								return;
							}

							profile.setUserInfo(userInfo);
							profile.renderName();

							notify.create(250, {
								act: 'success',
								title: 'Успешно',
								message: 'Ваши данные сохранены.'
							});
						});
				}
			}]
		}
	});
};

profile.parseBirthdate = function parseBirthdate(time) {
	const date = new Date(time * 1000);
	const day = date.getDate();
	const month = date.getMonth() + 1;
	const year = date.getFullYear();

	return [ day, month, year ]
		.map(interpolateInt)
		.join('.');
};

profile.parseBirthdateUS = function parseBirthdateUS(time) {
	const [ day, month, year ] = this.parseBirthdate(time).split('.');

	return [ month, day, year ].join('.');
};

profile.transformBirthdate = function transformBirthdate(birthdate) {
	const [ day, month, year ] = birthdate.split('.');

	return new Date( [ month, day, year ].join('.') ).getTime() / 1000;
};

profile.saveBirthdate = async function saveBirthdate(modal) {
	const result = {
		ok: false
	};
	const { main } = modal.selectors;	
	const birthdate = main.find('#birthdate');

	if (!birthdate.val()) {
		return result;
	}

	result.ok = true;
	result.birthdate = this.transformBirthdate( 
		birthdate.val() 
	);

	return result;
};

profile.openBirthdateEditor = function openBirthdateEditor() {
	const { birthday } = this.userInfo;
	const modal = new Modal({
		width: 500,
		opened: true,
		title: 'Редактировать дату рождения',
		body: `
			<div class="user_data_row">
				<input class="user_data_input" placeholder="Нажмите для выбора даты рождения.." id="birthdate">
			</div>
		`,
		footer: {
			buttons: [{
				text: 'Закрыть',
				action: function() {
					this.remove();
				}
			}, {
				text: 'Сохранить',
				action: function(button) {
					profile.saveBirthdate(this)
						.then(({ ok, birthdate }) => {
							if (!ok) {
								return;
							}

							return user.update({
								birthday: birthdate
							});
						})
						.then(result => {
							if (typeof result === 'undefined') {
								notify.create(250, {
									act: 'error',
									title: 'Ошибка',
									message: 'Пожалуйста, не оставляйте поля пустыми.'
								});

								return;
							}

							if (!result) {
								notify.create(250, {
									act: 'error',
									title: 'Ошибка',
									message: 'Не удалось сохранить данные. Повторите попытку.'
								});

								return;
							}
							
							return user.get();
						})
						.then(userInfo => {
							if (!userInfo || !userInfo.id) {
								return;
							}

							profile.setUserInfo(userInfo);
							profile.renderBirthdate();

							notify.create(250, {
								act: 'success',
								title: 'Успешно',
								message: 'Ваши данные сохранены.'
							});
						});
				}
			}]
		}
	});

	const birthdatePicker = modal.selectors.main.find('#birthdate')
		.datepicker({
			maxDate: new Date()
		})
		.data('datepicker');
	

	if (birthday) {
		birthdatePicker.selectDate(
			new Date( this.parseBirthdateUS(birthday) )
		);
	}
};

profile.getRegionsListTemplate = function getRegionsListTemplate(userRegion) {
	const { list } = regions;
	let template = `
		<select id="regions_list">
	`;

	list.map(({ id, name }) =>
		template += `
			<option value="${id}" ${userRegion === id ?
				'selected':
				''
			}>${name}</option>
		`
	);

	template += `
		</select>
	`;

	return template;
};

profile.saveRegion = async function saveRegion(modal) {
	const result = {
		ok: false
	};
	const { main } = modal.selectors;	
	const regionsList = main.find('#regions_list');
	const selectedRegion = +regionsList.find('option:selected').val();

	result.ok = true;
	result.region = selectedRegion;

	return result;
};

profile.openRegionEditor = function openRegionEditor() {
	const { region } = this.userInfo;
	const modal = new Modal({
		width: 450,
		opened: true,
		title: 'Редактировать регион',
		body: `
			<div class="user_data_row">
				${this.getRegionsListTemplate(region)}
			</div>
		`,
		footer: {
			buttons: [{
				text: 'Закрыть',
				action: function() {
					this.remove();
				}
			}, {
				text: 'Сохранить',
				action: function(button) {
					profile.saveRegion(this)
						.then(({ ok, region }) => {
							if (!ok) {
								return;
							}

							return user.update({
								region
							});
						})
						.then(result => {
							if (typeof result === 'undefined') {
								notify.create(250, {
									act: 'error',
									title: 'Ошибка',
									message: 'Пожалуйста, не оставляйте поля пустыми.'
								});

								return;
							}

							if (!result) {
								notify.create(250, {
									act: 'error',
									title: 'Ошибка',
									message: 'Не удалось сохранить данные. Повторите попытку.'
								});

								return;
							}
							
							return user.get();
						})
						.then(userInfo => {
							if (!userInfo || !userInfo.id) {
								return;
							}

							profile.setUserInfo(userInfo);
							profile.renderRegion();

							notify.create(250, {
								act: 'success',
								title: 'Успешно',
								message: 'Ваши данные сохранены.'
							});
						});
				}
			}]
		}
	});

	modal.selectors.main.find('#regions_list').selectric();
};

profile.getGendersListTemplate = function getGendersListTemplate(userGender) {
	const list = [{
		id: 1,
		name: 'Мужской',
	}, {
		id: 2,
		name: 'Женский'
	}];
	let template = `
		<select id="genders_list">
	`;

	list.map(({ id, name }) =>
		template += `
			<option value="${id}" ${(id === 2 && !userGender || userGender === 2) || userGender === id ?
				'selected':
				''
			}>${name}</option>
		`
	);

	template += `
		</select>
	`;

	return template;
};

profile.saveGender = async function saveGender(modal) {
	const result = {
		ok: false
	};
	const { main } = modal.selectors;	
	const gendersList = main.find('#genders_list');
	const selectedGender = +regionsList.find('option:selected').val();

	result.ok = true;
	result.region = selectedGender;

	return result;
};

profile.openGenderEditor = function openGenderEditor() {
	const { gender } = this.userInfo;
	const modal = new Modal({
		width: 450,
		opened: true,
		title: 'Редактировать пол',
		body: `
			<div class="user_data_row">
				${this.getGendersListTemplate(gender)}
			</div>
		`,
		footer: {
			buttons: [{
				text: 'Закрыть',
				action: function() {
					this.remove();
				}
			}, {
				text: 'Сохранить',
				action: function(button) {
					profile.saveGender(this)
						.then(({ ok, gender }) => {
							if (!ok) {
								return;
							}

							return user.update({
								gender
							});
						})
						.then(result => {
							if (typeof result === 'undefined') {
								notify.create(250, {
									act: 'error',
									title: 'Ошибка',
									message: 'Пожалуйста, не оставляйте поля пустыми.'
								});

								return;
							}

							if (!result) {
								notify.create(250, {
									act: 'error',
									title: 'Ошибка',
									message: 'Не удалось сохранить данные. Повторите попытку.'
								});

								return;
							}
							
							return user.get();
						})
						.then(userInfo => {
							if (!userInfo || !userInfo.id) {
								return;
							}

							profile.setUserInfo(userInfo);
							profile.renderGender();

							notify.create(250, {
								act: 'success',
								title: 'Успешно',
								message: 'Ваши данные сохранены.'
							});
						});
				}
			}]
		}
	});

	modal.selectors.main.find('#genders_list').selectric();
};

$(document).ready(() => {
	profile.initSelectors();
});