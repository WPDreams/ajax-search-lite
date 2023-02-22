(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        /**
         * This function should be called on-demand to init the settings. Do not call on init, only when needed.
         */
        initSettings: function() {
            if ( !this.settingsInitialized ) {
                this.loadASLFonts?.();
                this.initSettingsBox?.();
                this.initSettingsEvents?.();
                this.initFacetEvents?.();
            }
        },

        initSettingsBox: function() {
            let $this = this;
            let appendSettingsTo = function($el) {
                let old = $this.n('searchsettings').get(0);
                $this.nodes.searchsettings = $this.n('searchsettings').clone();
                $el.append($this.n('searchsettings'));


                $(old).find('*[id]').forEach(function(el){
                    if ( el.id.indexOf('__original__') < 0 ) {
                        el.id = '__original__' + el.id;
                    }
                });
                $this.n('searchsettings').find('*[id]').forEach(function(el){
                    if ( el.id.indexOf('__original__') > -1 ) {
                        el.id =  el.id.replace('__original__', '');
                    }
                });
            }

            // Calculates the settings animation attributes
            $this.initSettingsAnimations?.();

            appendSettingsTo($('body'));
            $this.n('searchsettings').get(0).id = $this.n('searchsettings').get(0).id.replace('__original__', '');
            $this.detectAndFixFixedPositioning();

            $this.settingsInitialized = true;
        },
        initSettingsAnimations: function() {
            let $this = this;
            $this.settAnim = {
                "showClass": "",
                "showCSS": {
                    "visibility": "visible",
                    "display": "block",
                    "opacity": 1,
                    "animation-duration": $this.animOptions.settings.dur + 'ms'
                },
                "hideClass": "",
                "hideCSS": {
                    "visibility": "hidden",
                    "opacity": 0,
                    "display": "none"
                },
                "duration": $this.animOptions.settings.dur + 'ms'
            };

            if ($this.animOptions.settings.anim == "fade") {
                $this.settAnim.showClass = "asl_an_fadeIn";
                $this.settAnim.hideClass = "asl_an_fadeOut";
            }

            if ($this.animOptions.settings.anim == "fadedrop" &&
                !$this.o.blocking ) {
                $this.settAnim.showClass = "asl_an_fadeInDrop";
                $this.settAnim.hideClass = "asl_an_fadeOutDrop";
            } else if ( $this.animOptions.settings.anim == "fadedrop" ) {
                // If does not support transitio, or it is blocking layout
                // .. fall back to fade
                $this.settAnim.showClass = "asl_an_fadeIn";
                $this.settAnim.hideClass = "asl_an_fadeOut";
            }

            $this.n('searchsettings').css({
                "-webkit-animation-duration": $this.settAnim.duration + "ms",
                "animation-duration": $this.settAnim.duration + "ms"
            });
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);