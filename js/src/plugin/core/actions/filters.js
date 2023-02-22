(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        setFilterStateInput: function( timeout ) {
            let $this = this;
            if ( typeof timeout == 'undefined' ) {
                timeout = 65;
            }
            let process = function(){
                if ( JSON.stringify($this.originalFormData) != JSON.stringify(helpers.formData($('form', $this.n('searchsettings'))) ) )
                    $this.n('searchsettings').find('input[name=filters_initial]').val(0);
                else
                    $this.n('searchsettings').find('input[name=filters_initial]').val(1);
            };
            if ( timeout == 0 ) {
                process();
            } else {
                // Need a timeout > 50, as some checkboxes are delayed (parent-child selection)
                setTimeout(function () {
                    process();
                }, timeout);
            }
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);