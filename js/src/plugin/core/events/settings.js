(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        initSettingsSwitchEvents: function() {
            let $this = this;
            $this.n('prosettings').on("click", function () {
                if ($this.n('prosettings').data('opened') == 0) {
                    $this.showSettings();
                } else {
                    $this.hideSettings();
                }
            });

            if ($this.o.settingsVisible == 1) {
                $this.showSettings(false);
            }
        },

        initSettingsEvents: function() {
            let $this = this, t;

            let formDataHandler = function(){
                // Let everything initialize (datepicker etc..), then get the form data
                if ( typeof $this.originalFormData === 'undefined' ) {
                    $this.originalFormData = helpers.formData($('form', $this.n('searchsettings')));
                }
                $this.n('searchsettings').off('mousedown touchstart mouseover', formDataHandler);
            };
            $this.n('searchsettings').on('mousedown touchstart mouseover', formDataHandler);

            let handler = function (e) {
                if ( $(e.target).closest('.asl_w').length == 0 ) {
                    if ( !$this.dragging ) {
                        $this.hideSettings?.();
                    }
                }
            };
            $this.documentEventHandlers.push({
                'node': document,
                'event': $this.clickTouchend,
                'handler': handler
            });
            $(document).on($this.clickTouchend, handler);

            // Note if the settings have changed
            $this.n('searchsettings').on('click', function(){
                $this.settingsChanged = true;
            });

            $this.n('searchsettings').on($this.clickTouchend, function (e) {
                $this.updateHref();

                /**
                 * Stop propagation on settings clicks, except the noUiSlider handler event.
                 * If noUiSlider event propagation is stopped, then the: set, end, change events does not fire properly.
                 */
                if ( typeof e.target != 'undefined' && !$(e.target).hasClass('noUi-handle') ) {
                    e.stopImmediatePropagation();
                } else {
                    // For noUI case, still cancel if this is a click (desktop device)
                    if ( e.type == 'click' )
                        e.stopImmediatePropagation();
                }
            });

            // Category level automatic checking and hiding
            $('.asl_option_cat input[type="checkbox"]', $this.n('searchsettings')).on('asl_chbx_change', function(){
                $this.settingsCheckboxToggle( $(this).closest('.asl_option_cat') );
            });
            // Init the hide settings
            $('.asl_option_cat', $this.n('searchsettings')).forEach(function(el){
                $this.settingsCheckboxToggle( $(el), false );
            });

            // Emulate click on checkbox on the whole option
            //$('div.asl_option', $this.n('searchsettings')).on('mouseup touchend', function(e){
            $('div.asl_option', $this.n('searchsettings')).on($this.mouseupTouchend, function(e){
                e.preventDefault(); // Stop firing twice on mouseup and touchend on mobile devices
                e.stopImmediatePropagation();

                if ( $this.dragging ) {
                    return false;
                }
                $(this).find('input[type="checkbox"]').prop("checked", !$(this).find('input[type="checkbox"]').prop("checked"));
                // Trigger a custom change event, for max compatibility
                // .. the original change is buggy for some installations.
                clearTimeout(t);
                let _this = this;
                t = setTimeout(function() {
                    $(_this).find('input[type="checkbox"]').trigger('asl_chbx_change');
                }, 50);

            });

            $('div.asl_option label', $this.n('searchsettings')).on('click', function(e){
                e.preventDefault(); // Let the previous handler handle the events, disable this
            });

            // Change the state of the choose any option if all of them are de-selected
            $('fieldset.asl_checkboxes_filter_box', $this.n('searchsettings')).forEach(function(){
                let all_unchecked = true;
                $(this).find('.asl_option:not(.asl_option_selectall) input[type="checkbox"]').forEach(function(){
                    if ($(this).prop('checked') == true) {
                        all_unchecked = false;
                        return false;
                    }
                });
                if ( all_unchecked ) {
                    $(this).find('.asl_option_selectall input[type="checkbox"]').prop('checked', false).removeAttr('data-origvalue');
                }
            });

            // Mark last visible options
            $('fieldset' ,$this.n('searchsettings')).forEach(function(){
                $(this).find('.asl_option:not(.hiddend)').last().addClass("asl-o-last");
            });

            // Select all checkboxes
            $('.asl_option_cat input[type="checkbox"], .asl_option_cff input[type="checkbox"]', $this.n('searchsettings')).on('asl_chbx_change', function(){
                let className = $(this).data("targetclass");
                if ( typeof className == 'string' && className != '')
                    $("input." + className, $this.n('searchsettings')).prop("checked", $(this).prop("checked"));
            });
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);