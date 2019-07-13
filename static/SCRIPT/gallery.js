'use strict';

class gallery {
    constructor() {
        this.imgs = [];
        this.nPics = 0;
        this.index = 0;
        this.parentBox = null;
        this.windowHeight = '';
        this.windowWidth = '';
    }

// Получить  изображения из внешнего источника
    getImgSrc(photoes) {
        this.imgs = photoes;
        this.nPics = this.imgs.length;
        return this;
    }

// сформировать изображения для галереи
    createImages(userId) {
        this.imgs.forEach(x => {
            x.imgHandler = new Image();
            x.imgHandler.src = x.photoOrig;
        })

        this.imgs.sort((a, b) => b.id - a.id)

        let galleryPreview = addElement({
            tag: 'figure',
            value: addElement({
                tag: 'img',
                attribs: {
                    "title": '',
                    "alt": '',
                    "src": this.imgs[0].photo
                }
            })
        });

        galleryPreview.onclick = () => {
            this.closeUpImg(userId)
        };
        return galleryPreview;
    }

// инициализировать галерею и запустить обработчик перемотки
    init(userId, galleryBox) {
        let imgInside = galleryBox.querySelector('figure')
        if(imgInside){
            galleryBox.replaceChild(this.createImages(userId), imgInside)
        } else {
            galleryBox.appendChild(this.createImages(userId))
            this.parentBox = galleryBox.parentNode.parentNode
        }
    }

// удалить изображение
    delImgByIndex(uid, delAlert) {
        let delImgId = this.imgs[this.index].id
        this.imgs[this.index].deleted = true
        getJSON(`${apiPath}/user/${uid}/photos/delete/${delImgId}`)
            .then(x => {
                delAlert.innerText = "Изображение удалено ";
                let replaceImg = this.imgs.find(img => img.id !== delImgId && !img.deleted)
                this.parentBox.querySelector('img').src = replaceImg ? replaceImg.photo : noImgLink
                /*найти в массиве изображение первое после удаленного и подставить в юзерпик, если
                изображения кончились - то заглушку */
            });
    }

// переназначить кнопки при смене изображения
    setGalleryButtons(prev, next, del, pic, delAlert, uid) {
        const setDeleter = () => {
            this.delImgByIndex(uid, delAlert);
        }

        const scrollForward = () => {
            this.index = this.index === this.nPics - 1 ? 0 : this.index + 1;
            pic.src = this.imgs[this.index].imgHandler.src;
            delAlert.innerText = this.imgs[this.index].deleted ? "Изображение удалено " : "";
            del.onclick = setDeleter;
        }

        del.onclick = setDeleter;

        prev.onclick = () => {
            this.index = this.index === 0 ? this.nPics - 1 : this.index - 1;
            pic.src = this.imgs[this.index].imgHandler.src;
            delAlert.innerText = this.imgs[this.index].deleted ? "Изображение удалено " : "";
            del.onclick = setDeleter;
        }

        next.onmousedown = scrollForward;
        pic.onmousedown = scrollForward;
    }

// сформировать окно для показа укрупненной версии изображения
    closeUpImg(userId) {
        let bgData = getComputedStyle(document.querySelector('html'));
        this.windowHeight = bgData.height;
        this.windowWidth = bgData.width;

        let pictureFullSize = addElement({tag: 'img', attribs: {'src': this.imgs[this.index].imgHandler.src}});

        let delAlert = addElement({
            tag: 'div',
            classes: 'del-alert'
        });

        let delButton = addElement({
            tag: 'div',
            classes: ['graphic-button', 'del'],
            value: 'Удалить фотографию'
        });

        let prevButton = addElement({
            tag: 'div',
            classes: ['graphic-button', 'prev'],
        });

        let nextButton = addElement({
            tag: 'div',
            classes: ['graphic-button', 'forw'],
        });

        let result = addElement({
                tag: 'div',
                classes: 'photo-zoom',
                value: [
                    prevButton,
                    pictureFullSize,
                    nextButton,
                    delAlert,
                    delButton,
                    addElement({
                        tag: 'div',
                        classes: ['close-box-gallery'],
                    })
                ]
            }
        );

        result.onclick = () => {
            if (window.event.target.className === 'photo-zoom' || window.event.target.className === 'pic-and-controls') {
                this.parentBox.removeChild(result);
            }
        };

        this.setGalleryButtons(prevButton, nextButton, delButton, pictureFullSize, delAlert, userId);
        this.parentBox.appendChild(result);
    }
}