(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        initMagnifierEvents: function() {
            let $this = this, t;
            $this.n('promagnifier').on('click', function (e) {
                $this.keycode = e.keyCode || e.which;
                $this.ktype = e.type;

                $this.gaEvent?.('magnifier');

                // If redirection is set to the results page, or custom URL
                // noinspection JSUnresolvedVariable
                if (
                    $this.n('text').val().length >= $this.o.charcount &&
                    $this.o.redirectOnClick == 1 &&
                    $this.o.trigger.click != 'first_result'
                ) {
                    $this.doRedirectToResults('click');
                    clearTimeout(t);
                    return false;
                }

                if ( !( $this.o.trigger.click == 'ajax_search' || $this.o.trigger.click == 'first_result' ) ) {
                    return false;
                }

                $this.searchAbort();
                clearTimeout($this.timeouts.search);
                $this.n('proloading').css('display', 'none');

                $this.timeouts.search = setTimeout(function () {
                    // If the user types and deletes, while the last results are open
                    if (
                        ($('form', $this.n('searchsettings')).serialize() + $this.n('text').val().trim()) != $this.lastSuccesfulSearch ||
                        (!$this.resultsOpened && !$this.usingLiveLoader)
                    ) {
                        $this.search();
                    } else {
                        if ( $this.isRedirectToFirstResult() )
                            $this.doRedirectToFirstResult();
                        else
                            $this.n('proclose').css('display', 'block');
                    }
                }, $this.o.trigger.delay);
            });
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);