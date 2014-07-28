/* global angular, utils, moduleName */
var focusMouse = (function () {

    var scope = {};

    /**
     * Enable mouse functionality for focus manager
     */
    function enable() {
        scope.enabled = false;
        utils.addEvent(document, 'mousedown', onMouseDown);
    }

    /**
     * Disable mouse functionality for focus manager
     */
    function disable() {
        scope.enabled = false;
        utils.removeEvent(document, 'mousedown', onMouseDown);
    }

    /**
     * Listen to mousedown event. If there is FocusManager ID, enable FM otherwise disable FM.
     * @param evt
     */
    function onMouseDown(evt) {
        if (focusManager.canReceiveFocus(evt.target)) {
            focusManager.focus(evt.target);

            var parentId = focusQuery.getParentId(evt.target);
            if (parentId) {
                focusManager.enable();
            } else {
                focusManager.disable();
            }
        }
    }

    scope.enabled = false;
    scope.enable = enable;
    scope.disable = disable;

    return scope;
})();

// enable focusMouse by default
focusMouse.enable();

