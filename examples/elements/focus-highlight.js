(function () {
    function getOffsetRect(el) {
        // (1) get bounding rect
        var box = el.getBoundingClientRect();

        var body = document.body;
        var docElem = document.documentElement;

        // (2) get scroll offset
        var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
        var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

        // (3) get position offset
        var clientTop = docElem.clientTop || body.clientTop || 0;
        var clientLeft = docElem.clientLeft || body.clientLeft || 0;

        // (4) calculate offset
        var top = box.top + scrollTop - clientTop;
        var left = box.left + scrollLeft - clientLeft;

        return { top: Math.round(top), left: Math.round(left), width: box.width, height: box.height };
    }

    function updateDisplay(el, activeElement) {
        if (focusManager.canReceiveFocus(activeElement)) {
            var rect = getOffsetRect(activeElement);
            el.style.left = rect.left + "px";
            el.style.top = rect.top + "px";
            el.style.width = rect.width + "px";
            el.style.height = rect.height + "px";
        }
    }

    Polymer('focus-highlight', {
        domReady: function () {
            var el = this;
            document.addEventListener('focus', function(evt){
                updateDisplay(el, evt.target);
            }, true);
        }
    });

})();
