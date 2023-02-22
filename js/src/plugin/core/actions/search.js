// noinspection JSUnresolvedVariable

(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        searchAbort: function() {
            let $this = this;
            if ( $this.post != null ) {
                $this.post.abort();
            }
        },

        searchWithCheck: function( timeout ) {
            let $this = this;
            if ( typeof timeout == 'undefined' )
                timeout = 50;

            if ($this.n('text').val().length < $this.o.charcount) return;
            $this.searchAbort();

            clearTimeout($this.timeouts.searchWithCheck);
            $this.timeouts.searchWithCheck = setTimeout(function() {
                $this.search();
            }, timeout);
        },

        search: function () {
            let $this = this;

            if ($this.searching && 0) return;
            if ($this.n('text').val().length < $this.o.charcount) return;

            $this.searching = true;
            $this.n('proloading').css({
                display: "block"
            });
            $this.n('proclose').css({
                display: "none"
            });

            let data = {
                action: 'ajaxsearchlite_search',
                aslp: $this.n('text').val(),
                asid: $this.o.id,
                options: $('form', $this.n('searchsettings')).serialize()
            };

            data = helpers.Hooks.applyFilters('asl/search/data', data);
            data = helpers.wp_hooks_apply_filters('asl/search/data', data);

            if ( JSON.stringify(data) === JSON.stringify($this.lastSearchData) ) {
                if ( !$this.resultsOpened )
                    $this.showResults();
                $this.hideLoader();
                if ( $this.isRedirectToFirstResult() ) {
                    $this.doRedirectToFirstResult();
                    return false;
                }
                return false;
            }

            $this.gaEvent?.('search_start');

            if ( $('.asl_es_' + $this.o.id).length > 0 ) {
                $this.liveLoad('.asl_es_' + $this.o.id, $this.getCurrentLiveURL(), false);
            } else if ( $this.o.resPage.useAjax ) {
                $this.liveLoad($this.o.resPage.selector, $this.getRedirectURL());
            } else {
                $this.post = $.fn.ajax({
                    'url': ASL.ajaxurl,
                    'method': 'POST',
                    'data': data,
                    'success': function (response) {
                        response = response.replace(/^\s*[\r\n]/gm, "");
                        response = response.match(/___ASLSTART___(.*[\s\S]*)___ASLEND___/)[1];

                        response = helpers.Hooks.applyFilters('asl/search/html', response);
                        response = helpers.wp_hooks_apply_filters('asl/search/html', response);

                        $this.n('resdrg').html("");
                        $this.n('resdrg').html(response);

                        $(".asl_keyword", $this.n('resdrg')).on('click', function () {
                            $this.n('text').val($(this).html());
                            $('input.orig', $this.n('container')).val($(this).html()).trigger('keydown');
                            $('form', $this.n('container')).trigger('submit', 'ajax');
                            $this.search();
                        });

                        $this.nodes.items = $('.item', $this.n('resultsDiv'));

                        $this.gaEvent?.('search_end', {'results_count': $this.n('items').length});

                        $this.gaPageview?.($this.n('text').val());

                        if ($this.isRedirectToFirstResult()) {
                            $this.doRedirectToFirstResult();
                            return false;
                        }

                        $this.hideLoader();
                        $this.showResults();
                        $this.scrollToResults();
                        $this.lastSuccesfulSearch = $('form', $this.n('searchsettings')).serialize() + $this.n('text').val().trim();
                        $this.lastSearchData = data;

                        $this.updateHref();

                        if ($this.n('items').length == 0) {
                            if ($this.n('showmore') != null) {
                                $this.n('showmore').css('display', 'none');
                            }
                        } else {
                            if ($this.n('showmore') != null) {
                                $this.n('showmore').css('display', 'block');

                                $('a', $this.n('showmore')).off();
                                $('a', $this.n('showmore')).on('click', function () {
                                    let source = $this.o.trigger.click, url;

                                    if (source == 'results_page') {
                                        url = '?s=' + helpers.nicePhrase($this.n('text').val());
                                    } else if (source == 'woo_results_page') {
                                        url = '?post_type=product&s=' + helpers.nicePhrase($this.n('text').val());
                                    } else {
                                        url = $this.o.trigger.redirect_url.replace('{phrase}', helpers.nicePhrase($this.n('text').val()));
                                    }

                                    if ($this.o.overridewpdefault) {
                                        if ($this.o.override_method == "post") {
                                            helpers.submitToUrl($this.o.homeurl + url, 'post', {
                                                asl_active: 1,
                                                p_asl_data: $('form', $this.n('searchsettings')).serialize()
                                            });
                                        } else {
                                            location.href = $this.o.homeurl + url + "&asl_active=1&p_asid=" + $this.o.id + "&p_asl_data=1&" + $('form', $this.n('searchsettings')).serialize()
                                        }
                                    } else {
                                        helpers.submitToUrl($this.o.homeurl + url, 'post', {
                                            np_asl_data: $('form', $this.n('searchsettings')).serialize()
                                        });
                                    }
                                });
                            }
                        }
                    },
                    'fail': function (jqXHR) {
                        if (jqXHR.aborted)
                            return;
                        $this.n('resdrg').html("");
                        $this.n('resdrg').html('<div class="asl_nores">The request failed. Please check your connection! Status: ' + jqXHR.status + '</div>');
                        $this.nodes.items = $('.item', $this.n('resultsDiv'));
                        $this.hideLoader();
                        $this.showResults();
                        $this.scrollToResults();
                    }
                });
            }
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);