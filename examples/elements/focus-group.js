/* global angular, utils, moduleName, focusElementId, focusGroupId, focusParentId, focusParentGroupId, this.tabIndex, focusGroup, focusGroupIndex, focusGroupHead, focusGroupTail, focusElement, focusEnabled, focusIndex, selectable */
var focusGroup = (function () {

    var groupId = 1, // unique id counter for groups
        elementId = 1, // unique id counter for selectable elements
        dispatcher = focusDispatcher(), // general reference to dispatcher
        delay = 100; // amount of time to delay before performing an action

    /**
     * Compile finds elements within a focus group and assigns them a unique element id
     * and a parent id (which references the group they belong to). If no tab index is
     * defined, then they will assigned a tabindex of -1 to prevent conflicts between
     * the browser's focus manager and this focus manager.
     * @param this.groupName
     * @param el
     */
    function compile(groupName, el) {
        var els, i, len, elementName;
        els = focusQuery.getElementsWithoutParents(el);
        len = els.length;
        i = 0;
        while (i < len) {
            elementName = elementId;
            focusQuery.setParentId(els[i], groupName);
            focusQuery.setElementId(els[i], elementName);

            this.tabIndex = focusQuery.getTabIndex(els[i]);
            if (this.tabIndex === undefined || this.tabIndex === null) {
                focusQuery.setTabIndex(els[i], -1); // elements in focus manager should not be tab enabled through browser
            }

            elementId += 1;
            i += 1;
        }

        els = focusQuery.getGroupsWithoutParentGroup(el);
        len = els.length;

        i = 0;
        while (i < len) {
            focusQuery.setParentGroupId(els[i], groupName);
            i += 1;
        }

        // TODO: THIS MAY ONLY NEED TO BE FIRED ONCE
        setTimeout(function () {
            var focusEl = el.querySelector('[focus-element="autofocus"]');
            if (focusEl) {
                focusManager.focus(focusEl);
                focusEl.focus();
            }
        });
    }

    function linker(scope, el) {
        this.groupName = groupId++;
        this.bound = false;
        this.cacheHtml = '';
        this.newCacheHtml = '';
        this.tabIndex = el.getAttribute('tabindex') || 0;

        focusQuery.setGroupId(el, this.groupName);
        compile.apply(this, [this.groupName, el]);

        // TODO: added this temporarily for polymer
//        this.setAttribute('focus-group', 'auto');

        if (!focusQuery.getParentGroupId(el)) { // this is an isolate focus group

            this.cacheHtml = el.innerHTML;

            el.setAttribute('tabindex', this.tabIndex);

            dispatcher.on('focusin', utils.debounce(function (evt) {
                console.log('focusin');
                // if group contains target then bind keys
                // TODO: Fix this for polymer
//                if (focusQuery.contains(el, evt.newTarget)) {
//                    if (this.bound === false) {
//                        this.bound = true;
//                        scope.$broadcast('bindKeys', this.groupName);
//                    }
//                } else {
//                    if (this.bound === true) {
//                        this.bound = false;
//                        scope.$broadcast('unbindKeys');
//                    }
//                }
            }, delay));

            dispatcher.on('enabled', function (evt) {
                var direction = focusKeyboard.direction;
                if (document.activeElement === el) {
                    if (direction === 'prev') {
                        focusManager.findPrevChildGroup(this.groupName);
                    } else {
                        focusManager.findNextElement(this.groupName);
                    }
                }

                if (document.activeElement === el || focusQuery.contains(el, document.activeElement)) {
                    el.removeAttribute('tabindex');
                } else {
                    el.setAttribute('tabindex', this.tabIndex);
                }
            });

            dispatcher.on('disabled', function () {
                setTimeout(function () {
                    if (document.activeElement === el || focusQuery.contains(el, document.activeElement)) {
                        el.removeAttribute('tabindex');
                    } else {
                        el.setAttribute('tabindex', this.tabIndex);
                    }
                });
            });
        }

        function onFocus() {
            focusManager.enable();
        }

        el.addEventListener('focus', onFocus, true);
    }

    Polymer('focus-group', {
        ready: function () {
            this.newCacheHtml = '';
            // Observe a single add/remove.
            this.onMutation(this, this.childrenUpdated);

            dispatcher.on('focus::compile', function (evt) {
                if (evt.target !== this) {
                    linker.apply(this, [
                        {},
                        this
                    ]);
                }
            }.bind(this));

        },
        childrenUpdated: function (observer, mutations) {

            var el = this;
            el.newCacheHtml = el.innerHTML;
            if (el.cacheHtml !== el.newCacheHtml) {
                var els = el.querySelectorAll('[' + focusGroup + ']');
                var i = els.length, groupId;
                while (i) {
                    i -= 1;
                    groupId = els[i].getAttribute(focusGroupId);
                }
                this.cacheHtml = el.newCacheHtml;
            }

            compile.apply(el, [el.groupName, el]);

            // Monitor again
            el.onMutation(el, el.childrenUpdated);

        },
        domReady: function () {
            dispatcher.trigger('focus::compile', { target: this });

            // TODO: FOR TESTING PURPOSES ONLY
            var el = this;
            setTimeout(function () {
                el.insertAdjacentHTML('afterBegin', '<a href="#" focus-element="autofocus">Hello, world</a>');
            }, 1000);
        }
    });

})();