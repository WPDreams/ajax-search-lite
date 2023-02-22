(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        initEtc: function() {
            helpers.Hooks.addFilter('asl/init/etc', this);
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);