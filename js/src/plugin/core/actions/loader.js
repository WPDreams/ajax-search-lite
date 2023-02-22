(function($){
    "use strict";
    let functions = {
        showLoader: function( ) {
            this.n('proloading').css({
                display: "block"
            });
        },

        hideLoader: function( ) {
            let $this = this;

            $this.n('proloading').css({
                display: "none"
            });
            $this.n('results').css("display", "");
        },
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);