(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        searchFor: function( phrase ) {
            if ( typeof phrase != 'undefined' ) {
                this.n('text').val(phrase);
            }
            this.n('textAutocomplete').val('');
            this.search(false, false, false, true);
        },

        toggleSettings: function( state ) {
            // state explicitly given, force behavior
            if (typeof state != 'undefined') {
                if ( state == "show") {
                    this.showSettings();
                } else {
                    this.hideSettings();
                }
            } else {
                if ( this.n('prosettings').data('opened') == 1 ) {
                    this.hideSettings();
                } else {
                    this.showSettings();
                }
            }
        },

        closeResults: function( clear ) {
            if (typeof(clear) != 'undefined' && clear) {
                this.n('text').val("");
                this.n('textAutocomplete').val("");
            }
            this.hideResults();
            this.n('proloading').css('display', 'none');
            this.hideLoader();
            this.searchAbort();
        },

        getStateURL: function() {
            let url = location.href,
                sep;
            url = url.split('p_asid');
            url = url[0];
            url = url.replace('&asl_active=1', '');
            url = url.replace('?asl_active=1', '');
            url = url.slice(-1) == '?' ? url.slice(0, -1) : url;
            url = url.slice(-1) == '&' ? url.slice(0, -1) : url;
            sep = url.indexOf('?') > 1 ? '&' :'?';
            return url + sep + "p_asid=" + this.o.id + "&p_asl_data=1&" + $('form', this.n('searchsettings')).serialize();
        },

        resetSearch: function() {
            this.resetSearchFilters();
        },

        filtersInitial: function() {
            return this.n('searchsettings').find('input[name=filters_initial]').val() == 1;
        },

        filtersChanged: function() {
            return this.n('searchsettings').find('input[name=filters_changed]').val() == 1;
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);