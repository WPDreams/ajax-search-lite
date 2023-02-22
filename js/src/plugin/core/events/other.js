(function($){
    "use strict";
    let _static = window.WPD.ajaxsearchlite;
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        initOtherEvents: function() {
            let $this = this, handler, handler2;

            if ( helpers.isMobile() && helpers.detectIOS() ) {
                /**
                 * Memorize the scroll top when the input is focused on IOS
                 * as fixed elements scroll freely, resulting in incorrect scroll value
                 */
                $this.n('text').on('touchstart', function () {
                    $this.savedScrollTop = window.scrollY;
                    $this.savedContainerTop = $this.n('search').offset().top;
                });
            }

            $this.n('proclose').on($this.clickTouchend, function (e) {
                //if ($this.resultsOpened == false) return;
                e.preventDefault();
                e.stopImmediatePropagation();
                $this.n('text').val("");
                $this.n('textAutocomplete').val("");
                $this.hideResults();
                $this.n('text').trigger('focus');

                $this.n('proloading').css('display', 'none');
                $this.hideLoader();
                $this.searchAbort();

                if ( $('.asl_es_' + $this.o.id).length > 0 ) {
                    $this.showLoader();
                    $this.liveLoad('.asl_es_' + $this.o.id, $this.getCurrentLiveURL(), false);
                } else if ( $this.o.resPage.useAjax ) {
                    $this.showLoader();
                    $this.liveLoad($this.o.resPage.selector, $this.getRedirectURL());
                }

                $this.n('text').get(0).focus();
            });

            if ( helpers.isMobile() ) {
                handler = function () {
                    $this.orientationChange();
                    // Fire once more a bit delayed, some mobile browsers need to re-zoom etc..
                    setTimeout(function(){
                        $this.orientationChange();
                    }, 600);
                };
                $this.documentEventHandlers.push({
                    'node': window,
                    'event': 'orientationchange',
                    'handler': handler
                });
                $(window).on("orientationchange", handler);
            } else {
                handler = function () {
                    $this.resize();
                };
                $this.documentEventHandlers.push({
                    'node': window,
                    'event': 'resize',
                    'handler': handler
                });
                $(window).on("resize", handler, {passive: true});
            }

            handler2 = function () {
                $this.scrolling(false);
            };
            $this.documentEventHandlers.push({
                'node': window,
                'event': 'scroll',
                'handler': handler2
            });
            $(window).on('scroll', handler2, {passive: true});

            // Mobile navigation focus
            // noinspection JSUnresolvedVariable
            if ( helpers.isMobile() && $this.o.mobile.menu_selector != '' ) {
                // noinspection JSUnresolvedVariable
                $($this.o.mobile.menu_selector).on('touchend', function(){
                    let _this = this;
                    setTimeout(function () {
                        let $input = $(_this).find('input.orig');
                        $input = $input.length == 0 ? $(_this).next().find('input.orig') : $input;
                        $input = $input.length == 0 ? $(_this).parent().find('input.orig') : $input;
                        $input = $input.length == 0 ? $this.n('text') : $input;
                        if ( $this.n('search').inViewPort() ) {
                            $input.get(0).focus();
                        }
                    }, 300);
                });
            }

            // Prevent zoom on IOS
            if ( helpers.detectIOS() && helpers.isMobile() && helpers.isTouchDevice() ) {
                if ( parseInt($this.n('text').css('font-size')) < 16 ) {
                    $this.n('text').data('fontSize', $this.n('text').css('font-size')).css('font-size', '16px');
                    $this.n('textAutocomplete').css('font-size', '16px');
                    $('body').append('<style>#ajaxsearchlite'+$this.o.rid+' input.orig::-webkit-input-placeholder{font-size: 16px !important;}</style>');
                }
            }
        },

        orientationChange: function() {
            let $this = this;
            $this.detectAndFixFixedPositioning();
            $this.fixSettingsPosition();
            $this.fixResultsPosition();

            if ( $this.o.resultstype == "isotopic" && $this.n('resultsDiv').css('visibility') == 'visible' ) {
                $this.calculateIsotopeRows();
                $this.showPagination(true);
                $this.removeAnimation();
            }
        },

        resize: function () {
            let $this = this;
            $this.detectAndFixFixedPositioning();
            $this.fixSettingsPosition();
            $this.fixResultsPosition();

            if ( $this.o.resultstype == "isotopic" && $this.n('resultsDiv').css('visibility') == 'visible' ) {
                $this.calculateIsotopeRows();
                $this.showPagination(true);
                $this.removeAnimation();
            }
        },

        scrolling: function (ignoreVisibility) {
            let $this = this;
            $this.detectAndFixFixedPositioning();
            $this.hideOnInvisibleBox();
            $this.fixSettingsPosition(ignoreVisibility);
            $this.fixResultsPosition(ignoreVisibility);
        },

        initTryThisEvents: function() {
            let $this = this;
            // Try these search button events
            if ( $this.n('trythis').find('a').length > 0 ) {
                $this.n('trythis').find('a').on('click touchend', function (e) {
                    e.preventDefault();
                    e.stopImmediatePropagation();

                    document.activeElement.blur();
                    $this.n('textAutocomplete').val('');
                    $this.n('text').val($(this).html());
                    $this.gaEvent?.('try_this');
                    $this.searchWithCheck(80);
                });
                $this.n('trythis').css({
                    visibility: "visible"
                });
            }
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);