(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        showResults: function( ) {
            let $this = this;

            $this.initResults();

            // Create the scrollbars if needed
            $this.createVerticalScroll();
            $this.showVerticalResults();

            $this.hideLoader();

            $this.n('proclose').css({
                display: "block"
            });

            if ($this.n('showmore') != null) {
                if ($this.n('items').length > 0) {
                    $this.n('showmore').css({
                        'display': 'block'
                    });
                } else {
                    $this.n('showmore').css({
                        'display': 'none'
                    });
                }
            }

            if ( typeof WPD.lazy != 'undefined' ) {
                setTimeout(function(){
                    // noinspection JSUnresolvedVariable
                    WPD.lazy('.asl_lazy');
                }, 100)
            }

            $this.resultsOpened = true;
        },

        hideResults: function( blur ) {
            let $this = this;
            blur = typeof blur == 'undefined' ? true : blur;

            if ( !$this.resultsOpened ) return false;

            $this.n('resultsDiv').removeClass($this.resAnim.showClass).addClass($this.resAnim.hideClass);
            setTimeout(function(){
                $this.n('resultsDiv').css($this.resAnim.hideCSS);
            }, $this.resAnim.duration);

            $this.n('proclose').css({
                display: "none"
            });

            if ( helpers.isMobile() && blur )
                document.activeElement.blur();

            $this.resultsOpened = false;

            $this.n('s').trigger("asl_results_hide", [$this.o.id, $this.o.iid], true, true);
        },

        showResultsBox: function() {
            let $this = this;

            $this.n('s').trigger("asl_results_show", [$this.o.id, $this.o.iid], true, true);

            $this.n('resultsDiv').css({
                display: 'block',
                height: 'auto'
            });

            $this.n('resultsDiv').css($this.resAnim.showCSS);
            $this.n('resultsDiv').removeClass($this.resAnim.hideClass).addClass($this.resAnim.showClass);

            $this.fixResultsPosition(true);
        },

        scrollToResults: function( ) {
            let $this = this,
                tolerance = Math.floor( window.innerHeight * 0.1 ),
                stop;

            if (
                !$this.resultsOpened ||
                $this.o.scrollToResults.enabled !=1 ||
                $this.n('resultsDiv').inViewPort(tolerance)
            ) return;

            if ($this.o.resultsposition == "hover") {
                stop = $this.n('probox').offset().top - 20;
            } else {
                stop = $this.n('resultsDiv').offset().top - 20;
            }
            stop = stop + $this.o.scrollToResults.offset;

            let $adminbar = $("#wpadminbar");
            if ($adminbar.length > 0)
                stop -= $adminbar.height();
            stop = stop < 0 ? 0 : stop;
            window.scrollTo({top: stop, behavior:"smooth"});
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);