(function($){
    "use strict";
    let functions = {
        // If only google source is used, this is much faster..
        autocompleteGoogleOnly: function () {
            let $this = this,
                val = $this.n('text').val();
            if ($this.n('text').val() == '') {
                $this.n('textAutocomplete').val('');
                return;
            }
            let autocompleteVal = $this.n('textAutocomplete').val();
            if (autocompleteVal != '' && autocompleteVal.indexOf(val) == 0) {
                return;
            } else {
                $this.n('textAutocomplete').val('');
            }
            let lang = $this.o.autocomplete.lang;
            ['wpml_lang', 'polylang_lang', 'qtranslate_lang'].forEach( function(v){
                if (
                    $('input[name="'+v+'"]', $this.n('searchsettings')).length > 0 &&
                    $('input[name="'+v+'"]', $this.n('searchsettings')).val().length > 1
                ) {
                    lang = $('input[name="' + v + '"]', $this.n('searchsettings')).val();
                }
            });
            // noinspection JSUnresolvedVariable
            if ( $this.n('text').val().length >= $this.o.autocomplete.trigger_charcount ) {
                $.fn.ajax({
                    url: 'https://clients1.google.com/complete/search',
                    cors: 'no-cors',
                    data: {
                        q: val,
                        hl: lang,
                        nolabels: 't',
                        client: 'hp',
                        ds: ''
                    },
                    success: function (data) {
                        if (data[1].length > 0) {
                            let response = data[1][0][0].replace(/(<([^>]+)>)/ig, "");
                            response = $('<textarea />').html(response).text();
                            response = response.substr(val.length);
                            $this.n('textAutocomplete').val(val + response);
                            $this.fixAutocompleteScrollLeft();
                        }
                    }
                });
            }
        },

        fixAutocompleteScrollLeft: function() {
            this.n('textAutocomplete').get(0).scrollLeft = this.n('text').get(0).scrollLeft;
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);