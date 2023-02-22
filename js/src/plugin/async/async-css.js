// noinspection JSUnresolvedVariable

(function(){
    "use strict";
    let loadCSS = function() {
        let arr = [],
            els = document.getElementsByClassName("asl_m"),
            media_query = "def";
        for (let i = 0; i < els.length; i++) {
            if (typeof els[i].dataset != 'undefined') {
                arr[els[i].dataset.id] = true;
            }
        }

        if ( typeof ASL.media_query != "undefined" ) {
            media_query = ASL.media_query;
        }

        // If any active instances were found, load the basic JS
        if (arr.length > 0) {
            window.WPD.loadCSS(ASL.css_basic_url + "?mq=" + media_query);

            // Parse through and load only the required CSS files
            let last;
            for (let i = 0; i < arr.length; i++) {
                if (typeof arr[i] != "undefined") {
                    last = window.WPD.loadCSS(ASL.upload_url + "search" + i + ".css?mq=" + media_query);
                }
            }
            last.onload = function () {
                document.head.insertAdjacentHTML("beforeend", '<style>body .wpdreams_asl_sc{display: block; max-height: none; overflow: visible;}</style>');
                if (typeof window.ASL.init != 'undefined') {
                    window.WPD.intervalUntilExecute(window.ASL.init,
                        function() {
                            return typeof window.ASL.version != 'undefined' &&
                            typeof WPD.dom != 'undefined' &&
                            WPD.dom.fn.ajaxsearchlite != 'undefined'
                        }
                    );
                }
                window.ASL.css_loaded = true;
            };
        }
    }
    if ( typeof ASL != 'undefined' && typeof ASL.css_basic_url != 'undefined' ) {
        loadCSS();
    } else {
        let t, i = 0;
        t = setInterval(function(){
            ++i;
            if ( typeof ASL != 'undefined' && typeof ASL.css_basic_url != 'undefined' ) {
                loadCSS();
                clearInterval(t);
            }
            if ( i > 50 ) {
                clearInterval(t);
            }
        }, 100);
    }
}());