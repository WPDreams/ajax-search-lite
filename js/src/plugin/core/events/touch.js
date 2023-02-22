(function($){
    "use strict";
    let functions = {
        monitorTouchMove: function() {
            let $this = this;
            $this.dragging = false;
            $("body").on("touchmove", function(){
                $this.dragging = true;
            }).on("touchstart", function(){
                $this.dragging = false;
            });
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);