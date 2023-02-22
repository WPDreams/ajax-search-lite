// noinspection JSUnresolvedVariable

(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        detectAndFixFixedPositioning: function() {
            let $this = this,
                fixedp = false,
                n = $this.n('search').get(0);

            while (n) {
                n = n.parentElement;
                if ( n != null && window.getComputedStyle(n).position == 'fixed' ) {
                    fixedp = true;
                    break;
                }
            }

            if ( fixedp || $this.n('search').css('position') == 'fixed' ) {
                if ( $this.n('resultsDiv').css('position') == 'absolute' ) {
                    $this.n('resultsDiv').css({
                        'position':'fixed',
                        'z-index': 2147483647
                    });
                }
                if ( !$this.o.blocking ) {
                    $this.n('searchsettings').css({
                        'position':'fixed',
                        'z-index': 2147483647
                    });
                }
            } else {
                if ( $this.n('resultsDiv').css('position') == 'fixed' )
                    $this.n('resultsDiv').css('position', 'absolute');
                if ( !$this.o.blocking )
                    $this.n('searchsettings').css('position', 'absolute');
            }
        },

        fixResultsPosition: function(ignoreVisibility) {
            ignoreVisibility = typeof ignoreVisibility == 'undefined' ? false : ignoreVisibility;
            let $this = this,
                $body = $('body'),
                bodyTop = 0,
                rpos = $this.n('resultsDiv').css('position');

            if ( $._fn.bodyTransformY() != 0 || $body.css("position") != "static" ) {
                bodyTop = $body.offset().top;
            }

            /**
             * When CSS transform is present, then Fixed element are no longer fixed
             * even if the CSS declaration says. It is better to change them to absolute then.
             */
            if ( $._fn.bodyTransformY() != 0 && rpos == 'fixed' ) {
                rpos = 'absolute';
                $this.n('resultsDiv').css('position', 'absolute');
            }

            // If still fixed, no need to remove the body position
            if ( rpos == 'fixed' ) {
                bodyTop = 0;
            }

            if ( rpos != 'fixed' && rpos != 'absolute' ) {
                return;
            }

            if (ignoreVisibility == true || $this.n('resultsDiv').css('visibility') == 'visible') {
                let _rposition = $this.n('search').offset(),
                    bodyLeft = 0;

                if ( $._fn.bodyTransformX() != 0 || $body.css("position") != "static" ) {
                    bodyLeft = $body.offset().left;
                }

                if ( typeof _rposition != 'undefined' ) {
                    let vwidth, adjust = 0;
                    if ( helpers.deviceType() == 'phone' ) {
                        vwidth = $this.o.results.width_phone;
                    } else if ( helpers.deviceType() == 'tablet' ) {
                        vwidth = $this.o.results.width_tablet;
                    } else {
                        vwidth = $this.o.results.width;
                    }
                    if ( vwidth == 'auto') {
                        vwidth = $this.n('search').outerWidth() < 240 ? 240 : $this.n('search').outerWidth();
                    }
                    $this.n('resultsDiv').css('width', !isNaN(vwidth) ? vwidth + 'px' : vwidth);
                    if ( $this.o.resultsSnapTo == 'right' ) {
                        adjust = $this.n('resultsDiv').outerWidth() - $this.n('search').outerWidth();
                    } else if (( $this.o.resultsSnapTo == 'center' )) {
                        adjust = Math.floor( ($this.n('resultsDiv').outerWidth() - parseInt($this.n('search').outerWidth())) / 2 );
                    }

                    $this.n('resultsDiv').css({
                        top: (_rposition.top + $this.n('search').outerHeight(true) - bodyTop) + 'px',
                        left: (_rposition.left - adjust - bodyLeft) + 'px'
                    });
                }
            }
        },

        fixSettingsPosition: function(ignoreVisibility) {
            ignoreVisibility = typeof ignoreVisibility == 'undefined' ? false : ignoreVisibility;
            let $this = this,
                $body = $('body'),
                bodyTop = 0,
                settPos = $this.n('searchsettings').css('position');

            if ( $._fn.bodyTransformY() != 0 || $body.css("position") != "static" ) {
                bodyTop = $body.offset().top;
            }

            /**
             * When CSS transform is present, then Fixed element are no longer fixed
             * even if the CSS declaration says. It is better to change them to absolute then.
             */
            if ( $._fn.bodyTransformY() != 0 && settPos == 'fixed' ) {
                settPos = 'absolute';
                $this.n('searchsettings').css('position', 'absolute');
            }

            // If still fixed, no need to remove the body position
            if ( settPos == 'fixed' ) {
                bodyTop = 0;
            }

            if ( ignoreVisibility == true || $this.n('prosettings').data('opened') != 0 ) {
                let $n, sPosition, top, left,
                    bodyLeft = 0;

                if ( $._fn.bodyTransformX() != 0 || $body.css("position") != "static" ) {
                    bodyLeft = $body.offset().left;
                }
                $this.fixSettingsWidth();

                if ( $this.n('prosettings').css('display') != 'none' ) {
                    $n = $this.n('prosettings');
                } else {
                    $n = $this.n('promagnifier');
                }

                sPosition = $n.offset();

                top = (sPosition.top + $n.height() - 2 - bodyTop) + 'px';
                left = ($this.o.settingsimagepos == 'left' ?
                    sPosition.left : (sPosition.left + $n.width() - $this.n('searchsettings').width()) );
                left = left - bodyLeft + 'px';

                $this.n('searchsettings').css({
                    display: "block",
                    top: top,
                    left: left
                });
            }
        },

        fixSettingsWidth: function () {
            // There is always only 1 column in lite version
        },

        hideOnInvisibleBox: function() {
            let $this = this;
            if (
                $this.o.detectVisibility == 1 &&
                !$this.n('search').hasClass('hiddend') &&
                ($this.n('search').is(':hidden') || !$this.n('search').is(':visible'))
            ) {
                $this.hideSettings?.();
                $this.hideResults();
            }
        },
    }

    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);