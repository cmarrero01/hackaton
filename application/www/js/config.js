if (!window.CustomEvent) { // Create only if it doesn't exist
    (function () {
        function CustomEvent ( event, params ) {
            params = params || { bubbles: false, cancelable: false, detail: undefined };
            var evt = document.createEvent( 'CustomEvent' );
            evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
            return evt;
        }
        CustomEvent.prototype = window.Event.prototype;

        window.CustomEvent = CustomEvent;
    })();
}
//Http Environment
environment.constant('ENV',{
    //'socket':'http://192.168.1.34:7777',
    //'http':'http://192.168.1.34:7777'
    'socket':'http://192.168.5.164:7777',
    'http':'http://192.168.5.164:7777'
});