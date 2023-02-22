(function($){
    "use strict";
    let functions = {
        initAutop: function () {
            let $this = this;

            if ( $this.o.autop.state == "disabled" ) return false;

            let location = window.location.href;
            // Correct previous query arguments (in case of paginated results)
            let stop = location.indexOf('asl_ls=') > -1 || location.indexOf('asl_ls&') > -1;

            if ( stop ) {
                return false;
            }
            // noinspection JSUnresolvedVariable
            let count = $this.o.autop.count;
            window.WPD.intervalUntilExecute(function(){
                    $this.isAutoP = true;
                    if ($this.o.autop.state == "phrase") {
                        if ( !$this.o.is_results_page ) {
                            $this.n('text').val($this.o.autop.phrase);
                        }
                        $this.search(count);
                    } else if ($this.o.autop.state == "latest") {
                        $this.search(count, 1);
                    } else {
                        $this.search(count, 2);
                    }
                },
                function() { return (!window.ASL.css_async || typeof window.ASL.css_loaded != 'undefined') }
            );
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);