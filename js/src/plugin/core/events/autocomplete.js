(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        initAutocompleteEvent: function () {
            let $this = this;
            if ( $this.o.autocomplete.enabled == 1 ) {
                $this.n('text').on('keyup', function (e) {
                    $this.keycode = e.keyCode || e.which;
                    $this.ktype = e.type;
                    let thekey = 39;
                    // Lets change the keykode if the direction is rtl
                    if ($('body').hasClass('rtl'))
                        thekey = 37;
                    if ($this.keycode == thekey && $this.n('textAutocomplete').val() != "") {
                        e.preventDefault();
                        $this.n('text').val($this.n('textAutocomplete').val());
                        if ($this.post != null) $this.post.abort();
                        $this.search();
                    } else {
                        if ($this.postAuto != null) $this.postAuto.abort();
                        $this.autocompleteGoogleOnly();
                    }
                });
                $this.n('text').on('keyup mouseup input blur select', function(){
                   $this.fixAutocompleteScrollLeft();
                });
            }
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);