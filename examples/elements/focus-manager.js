Polymer('focus-manager', {
    created: function () {
        console.log('created', this);
    },
    ready: function () {
        console.log('ready');
    },
    attached: function () {
        console.log('attached');
    },
    domReady: function () {
        console.log('domReady');
    },
    detached: function () {
        console.log('detached');
    },
    attributeChanged: function (attrName, oldVal, newVal) {
        //var newVal = this.getAttribute(attrName);
        console.log(attrName, 'old: ' + oldVal, 'new:', newVal);
    }
});