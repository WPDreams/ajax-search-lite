(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        liveLoad: function(selector, url, updateLocation, forceAjax) {
            if ( selector == 'body' || selector == 'html' ) {
                console.log('Ajax Search Pro: Do not use html or body as the live loader selector.');
                return false;
            }

            // Store the current page HTML for the live loaders
            // It needs to be requested here as the dom does store the processed HTML, and it is no good.
            if ( ASL.pageHTML == "" ) {
                if ( typeof ASL._ajax_page_html === 'undefined' ) {
                    ASL._ajax_page_html = true;
                    $.fn.ajax({
                        url: location.href,
                        method: 'GET',
                        success: function(data){
                            ASL.pageHTML = data;
                        },
                        dataType: 'html'
                    });
                }
            }

            function process(data) {
                data = helpers.Hooks.applyFilters('asl/live_load/raw_data', data, $this);
                let parser = new DOMParser;
                let dataNode = parser.parseFromString(data, "text/html");
                let $dataNode = $(dataNode);

                // noinspection JSUnresolvedVariable
                if ( $this.o.statistics ) {
                    $this.stat_addKeyword($this.o.id, $this.n('text').val());
                }
                if ( data != '' && $dataNode.length > 0 && $dataNode.find(selector).length > 0 ) {
                    data = data.replace(/&asl_force_reset_pagination=1/gmi, '');
                    data = data.replace(/%26asl_force_reset_pagination%3D1/gmi, '');
                    data = data.replace(/&#038;asl_force_reset_pagination=1/gmi, '');

                    // Safari having issues with srcset when ajax loading
                    if ( helpers.isSafari() ) {
                        data = data.replace(/srcset/gmi, 'nosrcset');
                    }

                    data = helpers.Hooks.applyFilters('asl/live_load/html', data, $this.o.id, $this.o.iid);
                    data = helpers.wp_hooks_apply_filters('asl/live_load/html', data, $this.o.id, $this.o.iid);
                    $dataNode = $(parser.parseFromString(data, "text/html"));

                    //$el.replaceWith($dataNode.find(selector).first());
                    let replacementNode = $dataNode.find(selector).get(0);
                    replacementNode = helpers.Hooks.applyFilters('asl/live_load/replacement_node', replacementNode, $this, $el.get(0), data);
                    if ( replacementNode != null ) {
                        $el.get(0).parentNode.replaceChild(replacementNode, $el.get(0));
                    }

                    // get the element again, as it no longer exists
                    $el = $(selector).first();
                    if ( updateLocation ) {
                        document.title = dataNode.title;
                        history.pushState({}, null, url);
                    }

                    // WooCommerce ordering fix
                    $(selector).first().find(".woocommerce-ordering").on("change","select.orderby", function(){
                        $(this).closest("form").trigger('submit');
                    });

                    // Single highlight on live results
                    // noinspection JSUnresolvedVariable
                    if ( $this.o.singleHighlight == 1 ) {
                        $(selector).find('a').on('click', function(){
                            localStorage.removeItem('asl_phrase_highlight');
                            if ( helpers.unqoutePhrase( $this.n('text').val() ) != '' )
                                localStorage.setItem('asl_phrase_highlight', JSON.stringify({
                                    'phrase': helpers.unqoutePhrase( $this.n('text').val() )
                                }));
                        });
                    }

                    helpers.Hooks.applyFilters('asl/live_load/finished', url, $this, selector, $el.get(0));

                    // noinspection JSUnresolvedVariable
                    ASL.initialize();
                    $this.lastSuccesfulSearch = $('form', $this.n('searchsettings')).serialize() + $this.n('text').val().trim();
                    $this.lastSearchData = data;
                }
                $this.n('s').trigger("asl_search_end", [$this.o.id, $this.o.iid, $this.n('text').val(), data], true, true);
                $this.gaEvent?.('search_end', {'results_count': 'unknown'});
                $this.gaPageview?.($this.n('text').val());
                $this.hideLoader();
                $el.css('opacity', 1);
                $this.searching = false;
                if ( $this.n('text').val() != '' ) {
                    $this.n('proclose').css({
                        display: "block"
                    });
                }
            }

            updateLocation = typeof updateLocation == 'undefined' ? true : updateLocation;
            forceAjax = typeof forceAjax == 'undefined' ? false : forceAjax;

            // Alternative possible selectors from famous themes
            let altSel = [
                '.search-content',
                '#content', '#Content', 'div[role=main]',
                'main[role=main]', 'div.theme-content', 'div.td-ss-main-content',
                'main.l-content', '#primary'
            ];
            if ( selector != '#main' )
                altSel.unshift('#main');

            if ( $(selector).length < 1 ) {
                altSel.forEach(function(s){
                    if ( $(s).length > 0 ) {
                        selector = s;
                        return false;
                    }
                });
                if ( $(selector).length < 1 ) {
                    console.log('Ajax Search Lite: The live search selector does not exist on the page.');
                    return false;
                }
            }

            selector = helpers.Hooks.applyFilters('asl/live_load/selector', selector, this);

            let $el = $(selector).first(),
                $this = this;

            $this.searchAbort();
            $el.css('opacity', 0.4);

            helpers.Hooks.applyFilters('asl/live_load/start', url, $this, selector, $el.get(0));

            if (
                !forceAjax &&
                $this.n('searchsettings').find('input[name=filters_initial]').val() == 1 &&
                $this.n('text').val() == ''
            ) {
                window.WPD.intervalUntilExecute(function(){
                    process(ASL.pageHTML);
                }, function(){
                    return ASL.pageHTML != ''
                });
            } else {
                $this.searching = true;
                $this.post = $.fn.ajax({
                    url: url,
                    method: 'GET',
                    success: function(data){
                        process(data);
                    },
                    dataType: 'html',
                    fail: function(jqXHR){
                        $el.css('opacity', 1);
                        if ( jqXHR.aborted ) {
                            return;
                        }
                        $el.html("This request has failed. Please check your connection.");
                        $this.hideLoader();
                        $this.searching = false;
                        $this.n('proclose').css({
                            display: "block"
                        });
                    }
                });
            }
        },
        getCurrentLiveURL: function() {
            let $this = this;
            let url = 'asl_ls=' + helpers.nicePhrase( $this.n('text').val() ),
                start = '&',
                location = window.location.href;

            // Correct previous query arguments (in case of paginated results)
            location = location.indexOf('asl_ls=') > -1 ? location.slice(0, location.indexOf('asl_ls=')) : location;
            location = location.indexOf('asl_ls&') > -1 ? location.slice(0, location.indexOf('asl_ls&')) : location;

            // Was asl_ls missing but there are ASL related arguments? (ex. when using ASL.api('getStateURL'))
            location = location.indexOf('p_asid=') > -1 ? location.slice(0, location.indexOf('p_asid=')) : location;
            location = location.indexOf('asl_') > -1 ? location.slice(0, location.indexOf('asl_')) : location;

            if ( location.indexOf('?') === -1 ) {
                start = '?';
            }

            let final = location + start + url + "&asl_active=1&asl_force_reset_pagination=1&p_asid=" +
                $this.o.id + "&p_asl_data=1&" + $('form', $this.n('searchsettings')).serialize();
            // Possible issue when the URL ends with '?' and the start is '&'
            final = final.replace('?&', '?');

            return final;
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);