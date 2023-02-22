(function($){
    "use strict";
    let functions = {
        showSettings: function () {
            let $this = this;

            $this.initSettings?.();

            $this.n('searchsettings').css($this.settAnim.showCSS);
            $this.n('searchsettings').removeClass($this.settAnim.hideClass).addClass($this.settAnim.showClass);

            $this.n('prosettings').data('opened', 1);
            $this.fixSettingsPosition(true);
        },
        hideSettings: function () {
            let $this = this;

            $this.initSettings?.();

            $this.n('searchsettings').removeClass($this.settAnim.showClass).addClass($this.settAnim.hideClass);
            setTimeout(function(){
                $this.n('searchsettings').css($this.settAnim.hideCSS);
            }, $this.settAnim.duration);

            $this.n('prosettings').data('opened', 0);
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);