//
//
//
define([], function(_) {
    const httpGet = function(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                callback(xhr);
            }
        };
        xhr.send();
    };

    return function (config, trigger) {
        var modal = false;
        trigger.addEventListener('click', function (ev) {
            ev.preventDefault();
            if (modal === false) {
                fpjs.loader.on();
                httpGet(config.url, function(xhr) {
                    fpjs.loader.off();
                    if (xhr.status === 200) {
                        var htmlWrapper = document.createElement('div');
                        htmlWrapper.id = config.modal.id;
                        htmlWrapper.style.display = 'none';
                        htmlWrapper.innerHTML = xhr.responseText;
                        document.body.appendChild(htmlWrapper);
                        fpjs.mageInit();

                        require('FishPig_JsWidgetModal/js/modal', function(_modal) {
                            modal = _modal(config.modal, htmlWrapper);
                            setTimeout(function() {
                                modal.open();
                            }, 50);
                        });
                    } else {
                        console.error('Failed to load modal content from ' + config.url);
                    }
                });
            } else {
                modal.open();
            }
        });
    };
});