class Modal {
    static zIndex = 100;

    constructor({
        width = 400, 
        opened, 
        position = {}, 
        title,
        body, 
        footer = {}
    }) {
        this.selectors = {};
        this.selectors.main = this.render({
            width,
            title, 
            body,
            footer
        });
        this.selectors.bg = this.selectors.main.find('.bg');
        this.selectors.modal = this.selectors.main.find('.modal');
        this.selectors.close = this.selectors.modal.find('.title_wrap .close');

        const coords = this.getPosition(width);
        this.updatePosition(Object.keys(position).length ?
            {
                ...coords,
                ...position
            }:
            coords
        );

        this.attachCloseListeners();

        if (opened) {
            this.open();
        }
    }

    getBgTemplate() {
        return $(`
            <div class="bg"></div>
        `);
    }

    getModalTemplate({ width, title, body, footer }) {
        const modal = $(`
            <div class="modal" style="z-index: ${++Modal.zIndex}; width: ${width}px;"></div>
        `);

        modal.append(
            this.getTitleTemplate(title),
            this.getBodyTemplate(body),
            this.getFooterTemplate(footer)
        );

        return modal;
    }

    getTitleTemplate(title) {
        return $(`
            <div class="title_wrap">
                <div class="title">${title}</div>
                <div class="close">
                    <i class="fas fa-times"></i>
                </div>
            </div>
        `);
    }

    getBodyTemplate(body) {
        return $(`
            <div class="body">${body}</div>
        `);
    }

    getFooterTemplate({ buttons }) {
        if (!buttons.length) {
            return '';
        }

        const footer = $(`
            <div class="footer"></div>`
        );

        buttons.map(button =>
            footer.append( this.getFooterButtonTemplate(button) )
        );

        return footer;
    }

    getFooterButtonTemplate({ text, action }) {
        const button = $(`
            <div class="button">
                ${text}
            </div>
        `);
        button.on('click', () =>
            action.bind(this, button)()
        );

        return button;
    }

    render(options) {
        const modalWrap = $(`
            <div class="modal_wrap"></div>
        `);
        const bg = this.getBgTemplate();
        const modal = this.getModalTemplate(options);

        modalWrap.append(bg, modal);
        $('body').append( modalWrap );

        return modalWrap;
    }

    open() {
        const { main, modal } = this.selectors;

        main.addClass('opened');
        return animate(modal, 'bounceInUp');
    }

    hide() {
        const { main, modal } = this.selectors;

        return animate(modal, 'bounceOutDown')
            .then(() =>
                main.removeClass('opened')
            );
    }

    remove() {
        const { main } = this.selectors;

        this.hide()
            .then(() =>
                main.remove()
            );
    }

    getModalHeight() {
        const { modal } = this.selectors;

        return modal.innerHeight();
    }

    getPosition(width) {
        const wWidth = $(window).width();
        const wHeight = $(window).height();

        const left = (wWidth - width) / 2;
        const top = (wHeight - this.getModalHeight()) / 2;

        return {
            top,
            left
        };
    }

    updatePosition({ top, left }) {
        const { modal } = this.selectors;

        modal.css({
            top: `${top}px`,
            left: `${left}px`
        });
    }

    attachCloseListeners() {
        const { bg, close } = this.selectors;

        bg.on('click', () =>
            this.remove()
        );
        close.on('click', () =>
            this.remove()
        );
    }
}