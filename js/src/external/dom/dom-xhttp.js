(function() {
    // Prevent duplicate loading
    if ( typeof WPD.dom.fn.ajax != "undefined" ) {
        return false;	// Terminate
    }
    WPD.dom.fn.ajax = function(args) {
        let defaults = {
            'url': '',
            'method': 'GET',
            'cors': 'cors', // cors, no-cors
            'data': {},
            'success': null,
            'fail': null,
            'accept': 'text/html',
            'contentType': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        args = this.extend(defaults, args);

        if ( args.cors != 'cors' ) {
            let fn = 'ajax_cb_' + this.uuidv4().replaceAll('-', '');
            WPD.dom.fn[fn] = function() {
                args.success.apply(this, arguments);
                delete WPD.dom.fn[args.data.fn];
            };
            args.data.callback = 'WPD.dom.fn.' + fn;
            args.data.fn = fn;
            let script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = args.url + '?' + this.serializeForAjax(args.data);
            script.onload = function(){this.remove();};
            document.body.appendChild(script);
        } else {
            let xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if ( args.success != null ) {
                    if ( this.readyState == 4 && this.status == 200 ) {
                        args.success(this.responseText);
                    }
                }
                if ( args.fail != null ) {
                    if ( this.readyState == 4 && this.status >= 400 ) {
                        args.fail(this);
                    }
                }
            };

            xhttp.open(args.method.toUpperCase(), args.url, true);
            xhttp.setRequestHeader('Content-type', args.contentType);
            xhttp.setRequestHeader('Accept', args.accept);

            xhttp.send(this.serializeForAjax(args.data));
            return xhttp;
        }
    };
    document.dispatchEvent(new Event('wpd-dom-xhttp-loaded'));
}());