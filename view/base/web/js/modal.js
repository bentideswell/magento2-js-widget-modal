//
//
//
define([], function(_) {
    function forEach(e,c) {
        if (e.length>0) {
            [].forEach.call(e,c);
        }
    }

    // Helper function to make getting a modal easier
    function getModalById(id) {
        var modal = false;
        forEach(modals, function (_modal) {
            if (_modal.config.id === id) {
                modal = _modal;
            }
        });

        return modal;
    }

    // Open a specific modal using it's ID
    function openModal(id) {
        var modal;
        if (modal = getModalById(id)) {
            if (modal.element.classList.contains(classModalActive)) {
                // Modal already active
                return;
            }

            document.body.classList.add(classBodyHasModals);
            modal.element.classList.add(classModalActive);
        }
    };

    //
    function closeModal(id) {
        if (typeof id !== 'string'|| !id) {
            forEach(modals, function (modal) {
                closeModal(modal.config.id);
            });
        } else {
            var modal = getModalById(id);

            if (modal) {
                modal.element.classList.remove(classModalActive)
            }
        }

        document.body.classList.remove(classBodyHasModals);
    }

    // Defaults and class names
    var triggerAttributeName = 'data-modal',
        classWrapper = 'modals',
        classOverlay = 'overlay',
        classModalActive = '-active',
        classBodyHasModals = '-modals';

    var modals = [];

    // Create the modal wrapper
    var modalsWrapper = document.createElement('aside');
    modalsWrapper.classList.add(classWrapper);
    document.body.appendChild(modalsWrapper);

    var modalsInner = document.createElement('div');
    modalsInner.classList.add('modals-inner');
    modalsWrapper.appendChild(modalsInner);

    // Create overlay
    var modalsOverlay = document.createElement('div');
    modalsOverlay.classList.add(classOverlay);

    modalsInner.appendChild(modalsOverlay);
    modalsOverlay.addEventListener('click', function (event) {
        closeModal();
    });
    // Register object on window for easy access
    window.__modals = {
        open: openModal,
        close: closeModal
    };

    var allowedConfigs = {
        slide: ['left', 'right', 'top', 'bottom'],
        popup: ['top', 'center', 'bottom', 'full'],
        fixed: ['center']
    };

    //
    return function (config, element) {
        if (!config.id) {
            config.id = element.id;
        }

        if (!config.id) {
            console.error('Cannot create a modal without an ID.');
            return false;
        } else if (getModalById(config.id)) {
            console.error("A modal already exists with the ID '" + config.id + "'");
            return false;
        }

        if (!config.method || !allowedConfigs.hasOwnProperty(config.method)) {
            config.method = 'slide';
        }

        if (!config.position || allowedConfigs[config.method].indexOf(config.position) === -1) {
            console.error('Invalid config.position for config.method');
            return false;
        }

        if (!config.size) {
            config.size = 'small';
        }

        var wrapper = document.createElement('div');

        wrapper.classList.add('-modal');
        wrapper.classList.add(config.id);
        wrapper.classList.add('-' + config.method);
        wrapper.classList.add('-' + config.position);
        wrapper.classList.add('-' + config.size);

        var inner = document.createElement('div');
        inner.classList.add('inner');
        inner.appendChild(element);
        wrapper.appendChild(inner);
        modalsInner.appendChild(wrapper);

        element.style.display = null;
        
        forEach(
            document.querySelectorAll('[' + triggerAttributeName + '="' + config.id + '"]'),
            function (trigger) {
                trigger.addEventListener('click', function (event) {
                    event.preventDefault();
                    openModal(event.currentTarget.getAttribute(triggerAttributeName));
                });
            }
        );

        // Register modal
        modals.push({element: wrapper, config: config});

        if (window.location.hash) {
            openModal(window.location.hash.replace('#', ''));
        }

        forEach(
            wrapper.querySelectorAll('[data-modal-action="close"]'),
            function (closeTrigger) {
                closeTrigger.addEventListener('click', function (event) {
                    closeModal();
                });
            }
        );

        return {
            open: function() {
                openModal(config.id);
            },
            close: function() {
                closeModal(config.id);
            }
        };
    };
});
