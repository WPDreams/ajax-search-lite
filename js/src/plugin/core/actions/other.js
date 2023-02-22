(function($){
    "use strict";
    let functions = {
        loadASLFonts: function() {
            if ( ASL.font_url !== false ) {
                let font = new FontFace(
                    'aslsicons2',
                    'url(' + ASL.font_url + ')',
                    { style: 'normal', weight: 'normal', 'font-display': 'swap' }
                );
                font.load().then(function(loaded_face) {
                    document.fonts.add(loaded_face);
                }).catch(function(er) {});
                ASL.font_url = false;
            }
        },

        /**
         * Updates the document address bar with the ajax live search attributes, without push state
         */
        updateHref: function( ) {
            if ( this.o.trigger.update_href && !this.usingLiveLoader ) {
                if (!window.location.origin) {
                    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
                }
                let url = this.getStateURL() + (this.resultsOpened ? '&asl_s=' : '&asl_ls=') + this.n('text').val();
                history.replaceState('', '', url.replace(location.origin, ''));
            }
        },

        /**
         * Checks if an element with the same ID and Instance was already registered
         */
        fixClonedSelf: function() {
            let $this = this,
                oldInstanceId = $this.o.iid,
                oldRID = $this.o.rid;
            while ( !ASL.instances.set($this) ) {
                ++$this.o.iid;
                if ($this.o.iid > 50) {
                    break;
                }
            }
            // oof, this was cloned
            if ( oldInstanceId != $this.o.iid ) {
                $this.o.rid = $this.o.id + '_' + $this.o.iid;
                $this.n('search').get(0).id = "ajaxsearchlite" + $this.o.rid;
                $this.n('search').removeClass('asl_m_' + oldRID).addClass('asl_m_' + $this.o.rid).data('instance', $this.o.iid);
                $this.n('searchsettings').get(0).id = $this.n('searchsettings').get(0).id.replace('settings'+ oldRID, 'settings' + $this.o.rid);
                if ( $this.n('searchsettings').hasClass('asl_s_' + oldRID) ) {
                    $this.n('searchsettings').removeClass('asl_s_' + oldRID)
                        .addClass('asl_s_' + $this.o.rid).data('instance', $this.o.iid);
                } else {
                    $this.n('searchsettings').removeClass('asl_sb_' + oldRID)
                        .addClass('asl_sb_' + $this.o.rid).data('instance', $this.o.iid);
                }
                $this.n('resultsDiv').get(0).id = $this.n('resultsDiv').get(0).id.replace('prores'+ oldRID, 'prores' + $this.o.rid);
                $this.n('resultsDiv').removeClass('asl_r_' + oldRID)
                    .addClass('asl_r_' + $this.o.rid).data('instance', $this.o.iid);
                $this.n('container').find('.asl_init_data').data('instance', $this.o.iid);
                $this.n('container').find('.asl_init_data').get(0).id =
                    $this.n('container').find('.asl_init_data').get(0).id.replace('asl_init_id_'+ oldRID, 'asl_init_id_' + $this.o.rid);

                $this.n('prosettings').data('opened', 0);
            }
        },
        destroy: function () {
            let $this = this;
            Object.keys($this.nodes).forEach(function(k){
               $this.nodes[k].off?.();
            });
            $this.n('searchsettings').remove?.();
            $this.n('resultsDiv').remove?.();
            $this.n('search').remove?.();
            $this.n('container').remove?.();
            $this.documentEventHandlers.forEach(function(h){
                $(h.node).off(h.event, h.handler);
            });
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);