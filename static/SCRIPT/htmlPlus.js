'use strict';
// Русификация календаря
const MONTHS = {
    "Jan": "Янв",
    "Feb": "Фев",
    "Mar": "Март",
    "Apr": "Апр",
    "May": "Май",
    "Jun": "Июнь",
    "Jul": "Июль",
    "Aug": "Авг",
    "Sep": "Сент",
    "Oct": "Октяб",
    "Nov": 'Нояб',
    "Dec": 'Декаб'
};
const RUS_MONTH = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек']
const RUS_MONTH_FULL = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']
const RUS_DAY = ['Вскр', 'Пнд', 'Втр', 'Ср', 'Чтв', 'Птн', 'Сб']
const RUS_DAY_FULL = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота']
const PASTTIME  = 11037600000000 // 50 лет назад
const EMAIL_TPL = /^[\w\dа-я-_\.]+(@)[\w\dа-я-_\.]+$/i;
const LOAD_ERROR= 'Ошибка Сети при загрузке страницы\n' // не заводим сообщение в словарь, оно должно отображаться, даже если словарь не прибыл
const millisecToWeek = 604800000; // преобразование миллисекунд в недели
// Начало пути к ключевым api
//const apiPath = 'http://api.bonus-class.ru'
const apiPath = 'http://0.0.0.0:8081'
const noImgLink = 'https://vk.com/images/camera_400.png' // ссылка на изображение по умолчанию
const testPollURL = apiPath + '/polls/5c97e844b639447e15030c43' // результаты голосования
// массив сообщений об ошибках при загрузке
const LOAD_ERR_MSG = {
    msgErr: 'не удалось загрузить список сообщений страницы\n',
    msgTmpl: 'не удалось загрузить шаблоны\n',
    msgStrg: 'не удалось получить список архивных сообщений\n',
    msgRgn: 'не удалось получить список регионов\n',
    msgTab: 'не удалось загрузить шаблоны таблиц\n',
    msgExp: 'не удалось получить сведения о других экспертах\n',
    msgPll: 'не удалось загрузить результаты голосования\n'
}
// проверить, является ли объект массивом
const isArray = obj => obj.constructor === Array;
// проверить, является ли переменная объектом
const isObject = obj => obj.constructor === Object;
// Добавить элемент, заданный в форме джсона
const addElement = elementData => {
    if(elementData.nodeType){
        return elementData;
    } else {
        let {tag, value, classes, attribs} = elementData;
        let result = document.createElement(tag);

        let addSubitem = (function(val){
            if(isObject(val) || val.nodeType){
                this.appendChild(addElement(val));
            } else {
                this.innerText = val;
            }
        }).bind(result);
     
        if(value){
            isArray(value) ? value.forEach(x=>{addSubitem(x)}) : addSubitem(value);
        } 

        if(classes){
            result.className = isArray(classes) ? classes.join(" ") : classes;
        }    
    
        if(attribs){
            for(let key in attribs){
                result.setAttribute(key, attribs[key]);
            }        
        }

        return result;
    }    
}
// вытащить сведения из внешнего ДЖСОН (имитация обращения на сервер)
const getJSON = path => new Promise((resolve, reject) => {
    let request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.overrideMimeType('text/plain; charset=UTF-8');
    request.onreadystatechange = function()
    {
        if(this.readyState === 4){            
            if(this.status === 200){
                let answer = JSON.parse(this.responseText)
                if(answer.error){
                    console.log('-------------')
                    console.log('error')
                    console.log(path)
                    reject(answer)
                } else {
                    resolve(answer)
                }
            } else {
                reject('network error')
            }
        }
    }
    request.send();
})
// обработчик загрузки файла
const loadFile = (fileHandler, path) => new Promise(resolve => {
    let request = new XMLHttpRequest();
    request.open('POST', path, true);
    request.onload = function()
    {
        if(this.status === 200){            
            resolve(JSON.parse(this.responseText));
        }
    }
    request.send(fileHandler);
})
// преобразовать строку инпута в формат для получения времени
const strToTime = str => {
    let timeArr = str.split('-')
    return (new Date(timeArr[0], timeArr[1] - 1, timeArr[2])).getTime()
}
// преобразовать время в читаемый формат дд.мм.гггг
const getReadableTime = time => {
    let temp = (new Date(time)).toDateString().split(' ');
    return `${temp[2].replace(/^0+/,'')}.${MONTHS[temp[1]]}.${temp[3]}`
}
// преобразовать время в читаемый формат дд.мм.гггг числами
const getReadableTimeNumber = time => {
    time = new Date(time);
    return `${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()}`
}
// определить количество недель, прошедших с заданного времени
const getTimeInfo = date => {
    let delta = Date.now() - date;
    let nWeeks = Math.floor(delta / millisecToWeek );
    
    return {
        nWeeks: nWeeks, // количество недель, прошедших с заданного времени
        minUntilNextWeek: ((nWeeks + 1) * millisecToWeek - delta) / 60000 // время в минутах до следующей недели
    }
}
// определить количество времени в днях/ часах/минутах из времени в минутах
const getTimeUntilNext = minutes => {
    let time_m = minutes % 60;
    let hours = Math.floor(minutes / 60);
    let time_h = hours % 24;
    let time_d = Math.floor(hours / 24);
    return `${time_d} д , ${time_h} ч , ${time_m.toFixed(0)} мин`;
}
// создать обработчик для загрузки файлов
const createLoader = (form, loadHandler, user, galleryBox) => e => {
    e.preventDefault();
    let fileHandler = new FormData(form);
    let attachedFile = loadHandler.files[0];
    if(attachedFile){
        fileHandler.append(attachedFile.name, attachedFile)
        getJSON(`${apiPath}/files/photos/upload`) // проверили, как приходит путь для загрузки
        .then(x => loadFile(fileHandler, apiPath + x)) // попытались загрузить файл 
        .then(x => {
            user.loadUserPhoto(x, galleryBox)
            //window.location.href = window.location.href;
        }) // задействовали метод юзера по подгрузке файла       
    }
}
// сделать элемент видимым по наведению на element и скрывать при нажатии на toggle
const disappearable = (element, hiddenContent, toggle) => {
    hiddenContent.style.display = 'none';
    
    element.onclick = () => {
        element.style.display = 'none';
        hiddenContent.style.display = 'block';
    }

    toggle.onclick = () => {
        let delayInvis = setTimeout(() => {
            element.style.display = 'block';
            hiddenContent.style.display = 'none';
            clearTimeout(delayInvis);
        }, 500)
    }
}
// сформировать мультипарт-данные для запроса
const createMultiPart = data => {
    let boundaryN = String(Math.random()).slice(2)
    let boundMiddle = `--${boundaryN}\r\n`;
    let boundEnd = `--${boundaryN}--\r\n`;
    let result = [boundMiddle];

    for(let key in data){
        result.push(`Content-Disposition: form-data; name="${key}"\r\n\r\n${data[key]}\r\n`);
    }
    return {boundary: boundaryN, payload: result.join(boundMiddle) + boundEnd};
}
// отправить данные запросом POST
const sendPostData = (data, path) => new Promise(resolve => {
    let request = new XMLHttpRequest();
    request.open('POST', path, true);
    request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');


    request.onreadystatechange = function()
    {
        if(this.readyState === 4 && this.status === 200){    
            resolve(JSON.parse(this.responseText))
        }	
    }

    var s = ""
    for(var k in data){
        var v = data[k]
        s = s + "&" + k + "=" + v
    }

    request.send(s);
})
// получить параметры гет-запроса
const retrieveGetPrm = link => {
    let result = {};
    link.split('?')[1].split('&').forEach(x => {
        let elements = x.split('=');
        result[elements[0]] = elements[1];
    });
    return result;  
}
// Сделать кнопку загрузки активной лишь после выбора хотя бы одного файла
const setActiveButton = (button, input) => {
    button.disabled = true;
    input.onchange = () => {
        button.disabled = input.files.length ? false : true;
    }
}
// Проверить наличие в массиве объектов элемента с полем, равным заданному значению
const getIndexOfElementValue = (arr, key, val) => {
    let result = arr.filter(element => {
        element[key] && element[key] === val
    })
    return result.length ? result[0] : false
}