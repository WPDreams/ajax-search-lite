(function($){
    "use strict";
    let functions = {
        initFacetEvents: function() {
            let $this = this;
            $('input[type=checkbox]', $this.n('searchsettings')).on('asl_chbx_change', function(e){
                $this.ktype = e.type;
                $this.n('searchsettings').find('input[name=filters_changed]').val(1);
                $this.gaEvent?.('facet_change', {
                    'option_label': $(this).closest('fieldset').find('legend').text(),
                    'option_value': $(this).closest('.asl_option').find('.asl_option_label').text() + ($(this).prop('checked') ? '(checked)' : '(unchecked)')
                });
                $this.setFilterStateInput(65);
                $this.searchWithCheck(80);
            });
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);