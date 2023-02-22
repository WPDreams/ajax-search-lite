// noinspection HttpUrlsUsage,JSUnresolvedVariable

(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        isRedirectToFirstResult: function() {
            let $this = this;
            // noinspection JSUnresolvedVariable
            return (
                    $('.asl_res_url', $this.n('resultsDiv')).length > 0 ||
                    $('.asl_es_' + $this.o.id + ' a').length > 0 ||
                    ( $this.o.resPage.useAjax && $($this.o.resPage.selector + 'a').length > 0)
                ) &&
                (
                    ($this.o.redirectOnClick == 1 && $this.ktype == 'click' && $this.o.trigger.click == 'first_result') ||
                    ($this.o.redirectOnEnter == 1 && ($this.ktype == 'input' || $this.ktype == 'keyup') && $this.keycode == 13 && $this.o.trigger.return == 'first_result')
                );
        },

        doRedirectToFirstResult: function() {
            let $this = this,
                _loc, url;

            if ( $this.ktype == 'click' ) {
                _loc = $this.o.trigger.click_location;
            } else {
                _loc = $this.o.trigger.return_location;
            }

            if ( $('.asl_res_url', $this.n('resultsDiv')).length > 0 ) {
                url =  $( $('.asl_res_url', $this.n('resultsDiv')).get(0) ).attr('href');
            } else if ( $('.asl_es_' + $this.o.id + ' a').length > 0 ) {
                url =  $( $('.asl_es_' + $this.o.id + ' a').get(0) ).attr('href');
            } else if ( $this.o.resPage.useAjax && $($this.o.resPage.selector + 'a').length > 0 ) {
                url =  $( $($this.o.resPage.selector + 'a').get(0) ).attr('href');
            }

            if ( url != '' ) {
                if (_loc == 'same') {
                    location.href = url;
                } else {
                    helpers.openInNewTab(url);
                }

                $this.hideLoader();
                $this.hideResults();
            }
            return false;
        },

        doRedirectToResults: function( ktype ) {
            let $this = this,
                _loc;

            if ( ktype == 'click' ) {
                _loc = $this.o.trigger.click_location;
            } else {
                _loc = $this.o.trigger.return_location;
            }
            let url = $this.getRedirectURL(ktype);

            // noinspection JSUnresolvedVariable
            if ($this.o.overridewpdefault) {
                // noinspection JSUnresolvedVariable
                if ( $this.o.resPage.useAjax == 1 ) {
                    $this.hideResults();
                    // noinspection JSUnresolvedVariable
                    $this.liveLoad($this.o.resPage.selector, url);
                    $this.showLoader();
                    if ($this.o.blocking == false) {
                        $this.hideSettings();
                    }
                    return false;
                }
                // noinspection JSUnresolvedVariable
                if ( $this.o.override_method == "post") {
                    helpers.submitToUrl(url, 'post', {
                        asl_active: 1,
                        p_asl_data: $('form', $this.n('searchsettings')).serialize()
                    }, _loc);
                } else {
                    if ( _loc == 'same' ) {
                        location.href = url;
                    } else {
                        helpers.openInNewTab(url);
                    }
                }
            } else {
                // The method is not important, just send the data to memorize settings
                helpers.submitToUrl(url, 'post', {
                    np_asl_data: $('form', $this.n('searchsettings')).serialize()
                }, _loc);
            }

            $this.n('proloading').css('display', 'none');
            $this.hideLoader();
            $this.hideResults();
            $this.searchAbort();
        },
        getRedirectURL: function(ktype) {
            let $this = this,
                url, source, final, base_url;
            ktype = typeof ktype !== 'undefined' ? ktype : 'enter';

            if ( ktype == 'click' ) {
                source = $this.o.trigger.click;
            } else {
                source = $this.o.trigger.return;
            }

            if ( source == 'results_page' || source == 'ajax_search' ) {
                url = '?s=' + helpers.nicePhrase( $this.n('text').val() );
            } else if ( source == 'woo_results_page' ) {
                url = '?post_type=product&s=' + helpers.nicePhrase( $this.n('text').val() );
            } else {
                base_url = $this.o.trigger.redirect_url;
                url = base_url.replace(/{phrase}/g, helpers.nicePhrase( $this.n('text').val() ));
            }
            // Is this an URL like xy.com/?x=y
            if ( $this.o.homeurl.indexOf('?') > 1 && url.indexOf('?') === 0 ) {
                url = url.replace('?', '&');
            }

            if ( $this.o.overridewpdefault && $this.o.override_method != 'post' ) {
                // We are about to add a query string to the URL, so it has to contain the '?' character somewhere.
                // ..if not, it has to be added
                let start = '&';
                if ( $this.o.homeurl.indexOf('?') === -1 && url.indexOf('?') === -1 ) {
                    start = '?';
                }
                let addUrl = url + start + "asl_active=1&p_asl_data=1&" + $('form', $this.n('searchsettings')).serialize();
                final = $this.o.homeurl + addUrl;
            } else {
                final = $this.o.homeurl + url;
            }

            // Double backslashes - negative lookbehind (?<!:) is not supported in all browsers yet, ECMA2018
            // This section should be only: final.replace(//(?<!:)\/\//g, '/');
            // Bypass solution, but it works at least everywhere
            final = final.replace('https://', 'https:///');
            final = final.replace('http://', 'http:///');
            final = final.replace(/\/\//g, '/');

            final = helpers.Hooks.applyFilters('asl/redirect/url', final, $this.o.id, $this.o.iid);
            final = helpers.wp_hooks_apply_filters('asl/redirect/url', final, $this.o.id, $this.o.iid);

            return final;
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);