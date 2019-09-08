function animate(selector, animationName) {
    const classes = `animated ${animationName}`;

    return new Promise(resolve => {
        (typeof selector === 'string' ? 
            $(selector):
            selector
        )
            .addClass(classes)
            .one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).removeClass(classes);

                resolve();
            });
    });
}