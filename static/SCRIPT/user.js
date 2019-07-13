'use srict';

class user
{
	constructor()
	{
		this.id = '';
		this.login = '';
		this.created = 0;
		this.voted = false;
		this.hashPass = '';
		this.state = '';
		this.pointValue = 0;
		this.position = 0;

		this.points = {
			"startPoints": 0,
			"votePoints": 0,
			"invitePoints": 0,
			"inviteVotePoints": 0
		},
		
		this.dossier = {
			fullName: [],
			birthday: '',
			region: '',
			phone: '',
			email: ''			
		};
		
		this.car = {
			mark: '',
			model: '',
			KASKOend: '',
			OSAGOend: ''
		}
		
		this.photoes = new gallery();
	}
// получить пользовательские данные из внешнего источника	
	getUserData(userData)
	{
		this.id = userData.id;
		this.created = userData.created;
		this.dossier.region = userData.region;

		if(userData.firstName){
			this.dossier.fullName.push(userData.firstName);
		} else {
			this.dossier.fullName.push('');
		}

		if(userData.lastName){
			this.dossier.fullName.push(userData.lastName);
		} else {
			this.dossier.fullName.push('');
		} 

		if(userData.middleName){
			this.dossier.fullName.push(userData.middleName);
		} else {
			this.dossier.fullName.push('');
		}

		this.dossier.birthday = userData.birthday;
		
		if(userData.phone){
			this.dossier.phone = userData.phone;
		}

		if(userData.email){
			this.dossier.email = userData.email;
		}
	
		if(userData.car){
			this.car = userData.car;
		}
		
		this.photoes.getImgSrc(userData.photos);
		return this;
	}
// получит все баллы пользователя
	getAllPoints()
	{
		let result = 0;
		for(let key in this.points){
			result += this.points[key];
		}
		return result;
	}
// отобразить заголовок-логин	
	renderLogin()
	{
		return addElement({
			tag: 'a',
			value: {tag: 'h2', value: this.login},
			attribs: {'href': `site/userdata/${this.login}`}
		})
	}
// преобразовать строку личных данных
	processDataString(key, regions, msg)
	{
		switch(key){
			case 'birthday': return getReadableTime(this.dossier[key]);
			case 'region': 
				let regionName = getIndexOfElementValue(regions, 'id', this.dossier[key])
				return regionName ? regionName.name : msg['noRegion'];
			default: return this.dossier[key];
		}	
	}
// отобразить личные данные пользователя	
	renderDossier(msg, template, regions)
	{
		let result = addElement({tag: 'ul'});
		for(let key in this.dossier){
			result.appendChild(renderLine(key, this.processDataString(key, regions, msg), template));
			if(template[key] && template[key].msg){
				let lineMsg = addElement({tag: 'span', classes: template[key].classes ? template[key].classes : ''});
				lineMsg.innerHTML = msg[template[key].msg];
				result.appendChild(lineMsg);
			}
		}

		this.setPropHandler( // настроили обработчик регионов
			result,
			selectRender(regions),
			'region',
			input => () => {
				for(let i = input.options.length - 1; i >= 0; i--){
					if(input.options[i].selected){
						sendPostData({"region": input.options[i].value}, `${apiPath}/user/${this.id}`)
						.then(x => {
							if(x){
								document.querySelector(`li#region`).childNodes[0].textContent = regions[i].name
							}
						})
						break;
				}}					
			},
			input => () => true,
			msg["new_region"]
		).setPropHandler(	// настроили обработчик емыла
			result,
			addElement({tag: 'input', attribs: {
				'type': 'text',
				'id': 'email',
				'placeholder': 'e-mail',
				'value': this.dossier.email}}),
			'email',
			inputs => () => {this.updateUserProps(inputs, 'email')},
			inputs => () => EMAIL_TPL.test(inputs.value),
			msg["new_email"]
		).setPropHandler(
			result,
			[
				addElement({tag: 'input', attribs: {'type': 'text', 'id': 'firstName', 'placeholder': 'Имя', 'value': this.dossier.fullName[0]}}),
				addElement({tag: 'input', attribs: {'type': 'text', 'id': 'middleName','placeholder': 'Отчество', 'value': this.dossier.fullName[2]}}),
				addElement({tag: 'input', attribs: {'type': 'text', 'id': 'lastName', 'placeholder': 'Фамилия', 'value': this.dossier.fullName[1]}})
			],
			'fullName',
			inputs => () => {this.updateUserProps(inputs,'fullName')},
			inputs => () => true,
			msg["new_fullName"]
		).setPropHandler(
			result,
			addElement({
				tag: 'input',
				attribs: {
					'type': 'date',
					'id': 'birthday',
				},
				classes: 'datepicker'
			}),
			'birthday',
			inputs => () => {
				let newTime = strToTime(inputs.value)
				sendPostData({"birthday": newTime}, `${apiPath}/user/${this.id}`)
				.then(x => {
					if(x){
						document.querySelector(`li#birthday`).childNodes[0].textContent = getReadableTime(newTime)
					}
				})
			},
			inputs => () => true,
			msg['new_birthday']	
		);

		return result;
	}
// Задать одно из свойств пользователя через блок инпутов и POST-запрос
	updateUserProps(inputs, dossierName)
	{
		let data = {};
		if(isArray(inputs)){
			for(let index in inputs){
				if(inputs[index].value){
					data[inputs[index].id] = inputs[index].value
				}				
			}
		} else {
			data[inputs.id] = inputs.value;
		}
		if(data){
			sendPostData(data, `${apiPath}/user/${this.id}`)
			.then(x => {
				if(x){
					let newVal = ''
					for(let key in data){
						newVal += (data[key] + ' ')
					}
					document.querySelector(`li#${dossierName}`).childNodes[0].textContent = newVal
				}
			});
		}
	}
// сформировать обработчик для заданного поля propName через функцию func , открываемый в элементе root с полем ввода input 
	setPropHandler(root, input, propName, func, checker, msgAbout, msgWarn)
	{
		
		
		root.querySelector(`#${propName} .change-button`).onclick = () => {
			let propertySetPopup = popupChangeProp(root, input, func, checker, msgAbout, msgWarn)
			root.appendChild(propertySetPopup)
		}

		return this;
	}
// отобразить данные об автомобиле пользователя	
	renderCar(msg)
	{
		return this.car.mark && this.car.model ? addElement({
			tag: 'div',
			value: [
				{
					tag: 'p',
					value:  replaceTemplate(
						msg["carModelMsg"],
						[
							{mask: '[MARK]', val: this.car.mark},
							{mask:'[MODEL]', val: this.car.model}
					])
				},
				{
					tag: 'p',
					value: replaceTemplate( msg["osagoMsg"], {mask: '[ODATE]', val: this.car.OSAGOend})
				},
				{
					tag: 'p',
					value: replaceTemplate( msg["kaskoMsg"], {mask: '[KDATE]', val: this.car.KASKOend})
				}
			]
		}) : document.createTextNode('');
	}
// отобразить данные о промоакциях, доступных пользователю	
	renderPromoDate(msg)
	{
		let {nWeeks, minUntilNextWeek} = getTimeInfo(this.created);
		let result = addElement({tag: 'div', classes: 'promo-action'});
		/*result.innerHTML = replaceTemplate(msg, [
			{mask: /\n/g, val: '<br/>'},
			{mask: '{time_to_end}', val: getTimeUntilNext(minUntilNextWeek)},
			{mask: '{weeks}', val: nWeeks},
			{mask: '{time_to_start}', val: getReadableTime(this.created)}
		]);*/
		return result;
	}	
// отобразить фотографии
	renderPhotoes(root)
	{
		if(this.photoes.imgs && this.photoes.imgs.length){
			this.photoes.init(this.id, root)
		} else {
			document.querySelector('.gallery').appendChild(
				addElement({
					tag: 'figure',
					value: addElement({
						tag: 'img',
						attribs:{'src': noImgLink}
					})
				})
			)
		}	
		return this;
	}
// отрендерить инфосообщение о баллах
	renderInfoPoints(msg){
		let result = addElement({tag: 'div', classes: 'info-msg'})

		result.innerHTML = replaceTemplate(msg, [{mask: /\n/g, val:'<br/>'}, {mask: '{cur_points}', val: this.getAllPoints()}]);
		return result;
	}
	/* таблица с данными экспертов первой линии */
	renderTableExperList(userData, tmpl, msg){
		let result = addElement({
			tag: 'table',
			value: [
				addElement({
					tag: 'thead',
					value: [
						renderTopHeader(msg[tmpl.topText], tmpl, [{mask: '[STATE]', val: this.state}, {mask:'[PVALUE]', val: this.pointValue}]),
						renderColHeader(tmpl, msg)
					]
				}),
				addElement({
					tag: 'tbody',
					value: userData.map(x => renderExpertLine(x))
				})
			]
		});
	
		result.querySelector('thead .email-sender').appendChild(addElement({
			tag: "div",
			value: [
				"Написать письмо",
				addElement({tag: 'br'}),
				addElement({
					tag: "label",
					value: ["Всем", addElement({tag: 'input', attribs: {"type": "checkbox"}})]
				})				
			],
			classes: "email-cell"
		}));
		return result;
	}
	/* сформировать таблицу для первой сотни*/
	renderFirstHundredTable(userData, templates, msg)
	{
		let renderFunc, tmpl;
		if(!userData.some(x => x.firstLineFol.active !== 0)){
			renderFunc = renderStage1;
			tmpl = templates.firstHundred1;
		} else if(!userData.some(x => x.firstLineFol.active === 0)) {
			renderFunc = renderStage3;
			tmpl = templates.firstHundred3;
		} else {
			renderFunc = renderStage2;
			tmpl = templates.firstHundred2;
		}

		return addElement({
			tag: 'table',
			value: [
				addElement({
					tag: 'thead',
					value: this.position <= 100 ? [
						renderTopHeader(msg["hundred1"], tmpl, {mask: '[CITY]', val: this.dossier.city}),
						renderTopHeader(msg["hundred2"], tmpl, {mask: '[CITY]', val: this.dossier.city}),
						renderColHeader(tmpl, msg)
					] : [
						renderTopHeader(msg["hundred1"], tmpl, {mask: '[CITY]', val: this.dossier.city}),
						renderColHeader(tmpl, msg)
					]
				}),
				addElement({
					tag: 'tbody',
					value: userData.map((x, i) => renderFunc(x, i))
				})
			]
		})
	}
	// загрузить фотографию пользователя через существующий апи
	loadUserPhoto(photoUrls, galleryBox)
	{
		sendPostData(
			{
				photo: photoUrls.photo,
				photoOrig: photoUrls.photoOrig, 
				photoSmall:  photoUrls.photoSmall
			},
			`${apiPath}/user/${this.id}/photos/add`
		).then(response => {
			let installid = response
			getJSON(`${apiPath}/user/${this.id}`).then(response => {
				this.photoes.getImgSrc(response.photos)
				this.renderPhotoes(galleryBox)
				
			})
		})
	}
}