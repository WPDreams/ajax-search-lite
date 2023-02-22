(function($){
    "use strict";
    let functions = {
        initResultsEvents: function() {
            let $this = this;

            $this.n('resultsDiv').css({
                opacity: "0"
            });

            let handler = function (e) {
                let keycode =  e.keyCode || e.which,
                    ktype = e.type;

                if ( $(e.target).closest('.asl_w').length == 0 ) {
                    $this.hideOnInvisibleBox();

                    // If not right click
                    if( ktype != 'click' || ktype != 'touchend' || keycode != 3 ) {
                        // noinspection JSUnresolvedVariable
                        if ($this.resultsOpened == false || $this.o.closeOnDocClick != 1) return;

                        if ( !$this.dragging ) {
                            $this.hideLoader();
                            $this.searchAbort();
                            $this.hideResults();
                        }
                    }
                }
            };
            $this.documentEventHandlers.push({
                'node': document,
                'event': $this.clickTouchend,
                'handler': handler
            });
            $(document).on($this.clickTouchend, handler);

            // GTAG on results click
            $this.n('resultsDiv').on('click', '.results .item', function() {
                $this.gaEvent?.('result_click', {
                    'result_title': $(this).find('a.asl_res_url').text(),
                    'result_url': $(this).find('a.asl_res_url').attr('href')
                });

                // Results highlight on results page
                // noinspection JSUnresolvedVariable
                if ( $this.o.singleHighlight == 1 ) {
                    localStorage.removeItem('asl_phrase_highlight');
                    if (  $this.n('text').val().replace(/["']/g, '')  != '' ) {
                        localStorage.setItem('asl_phrase_highlight', JSON.stringify({
                            'phrase': $this.n('text').val().replace(/["']/g, '')
                        }));
                    }
                }
            });
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);