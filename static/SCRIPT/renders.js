'use strict';
// отрисовать строку
const renderLine = (key, val, template) =>
{
	val = isArray(val) ? val.join(' ') : val;
    let result = addElement({tag: 'li', attribs: {'id': key}});
    	
	if(template[key] && template[key].linkable){
		val = addElement({
			tag: 'a',
			value: val,
			attribs: {
				'href': (template[key].isemail ? 'mailto: ' : '') + val,
				'target': '_blank'
			}
        })
        result.appendChild(val)	
    } else {
        result.innerHTML = val;
    }   

   if(template[key] && template[key].editable){
       result.appendChild(createChangeButton())
   }
   return result;
}
// создать кнопку изменения
const createChangeButton = () => addElement({
    tag: 'span',
    value: addElement({
        tag: 'i',
        classes: 'material-icons',
        value: 'edit'
    }),
    classes: 'change-button'
})
// кнопка удаления
const delPhotoButton = func => {
    let result = addElement({
        tag: 'div',
        value: 'удалить',
        classes: 'pseudobutton'
    });
    
    result.onclick = func;
    return result;
}
// применить шаблон с подстановкой
const replaceTemplate = (msg, replaces) => 
    isArray(replaces) ?
        replaces.reduce((x, y) => x.replace(y.mask, y.val), msg) :
        msg.replace(replaces.mask, replaces.val)
/* Отобразить данные о промо-акции */
const renderPromoAction = msg => {
    let result = addElement({tag: 'div', classes: 'info-msg'});
    result.innerHTML = msg.replace(/\n/g, '<br/>');
    return result;
}    
// на основе набора опций собрать список-селектор
const selectRender = options => addElement({
    tag: 'select',
    value: options.map(x => addElement({
        tag: 'option',
        value: x.name,
        attribs: {"value": x.id}
    }))
})
// создать кнопку для закрытия всплывающего окна
const renderPopupButton = (root, windowToDelete, classList, func = () => {}) => {
    let result = addElement({tag: 'div', classes: classList});
    result.onclick = () => {
        func();
        root.removeChild(windowToDelete);
    }
    return result; 
}
// создать кнопку для закрытия всплывающего окна c проверкой
const renderPopupValid = (root, windowToDelete, classList, func, checker) => {
    let result = addElement({tag: 'div', classes: classList});
    result.onclick = () => {
        if(checker()){
            func();
            root.removeChild(windowToDelete);
        } else {
            windowToDelete.querySelector('.err-msg').innerText = 'Ошибка заполнения'
        }
    }
    return result; 
}
/* функция создания попапа с произвольным инпутом для смены произвольного поля */
const popupChangeProp = (root, inputs, changePropFunc, checkerFunc, msgAbout, msgWarning = '') =>
{
	let result = addElement({tag: 'div', classes: 'popup-box'});
    let errMsg = addElement({tag: 'p', classes: 'err-msg'});
    isArray(inputs) ? inputs.forEach(inp => inp.onfocus = () => {errMsg.innerText = ''})
        : inputs.onfocus = () => {errMsg.innerText = ''}

    result.appendChild(addElement({
		tag: 'div',
		value:[
            addElement({tag: 'p', value: msgAbout}),
            addElement({
                tag: 'div',
                value: inputs,
                classes: 'inputs-box'
            }),
            errMsg,
			renderPopupValid(root, result, 'ok-box', changePropFunc(inputs), checkerFunc(inputs)),
			renderPopupButton(root, result, 'close-box')
		],
		classes: 'controls'
	}));
	return result;
}