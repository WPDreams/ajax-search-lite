// noinspection JSUnresolvedVariable

(function($){
    "use strict";
    let _static = window.WPD.ajaxsearchlite;
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        init: function (options, elem) {
            let $this = this;

            $this.searching = false;
            $this.triggerPrevState = false;

            $this.isAutoP = false;
            $this.autopStartedTheSearch = false;
            $this.autopData = {};

            $this.settingsInitialized = false;
            $this.resultsInitialized = false;
            $this.settingsChanged = false;
            $this.resultsOpened = false;
            $this.post = null;
            $this.postAuto = null;
            $this.scroll = {};
            $this.savedScrollTop = 0;   // Save the window scroll on IOS devices
            $this.savedContainerTop = 0;
            $this.disableMobileScroll = false;
            /**
             * on IOS touch (iPhone, iPad etc..) the 'click' event does not fire, when not bound to a clickable element
             * like a link, so instead, use touchend
             * Stupid solution, but it works..
             */
            $this.clickTouchend = 'click touchend';
            $this.mouseupTouchend = 'mouseup touchend';
            // NoUiSliders storage
            $this.noUiSliders = [];

            // An object to store various timeout events across methods
            $this.timeouts = {
                "compactBeforeOpen": null,
                "compactAfterOpen": null,
                "search": null,
                "searchWithCheck": null
            };

            $this.eh = {}; // this.EventHandlers -> storage for event handler references
            // Document and Window event handlers. Used to detach them in the destroy() method
            $this.documentEventHandlers = [
                /**
                 * {"node": document|window, "event": event_name, "handler": function()..}
                 */
            ];

            $this.settScroll = null;
            $this.currentPage = 1;
            $this.isotopic = null;
            $this.sIsotope = null;
            $this.lastSuccesfulSearch = ''; // Holding the last phrase that returned results
            $this.lastSearchData = {};      // Store the last search information
            $this._no_animations = false; // Force override option to show animations
            // Repetitive call related
            $this.call_num = 0;
            $this.results_num = 0;

            // this.n and this.o available afterwards
            // also, it corrects the clones and fixes the node varialbes
            $this.o = $.fn.extend({}, options);
            $this.nodes = {};
            $this.nodes.search = $(elem);

            // Make parsing the animation settings easier
            if ( helpers.isMobile() ) {
                $this.animOptions = $this.o.animations.mob;
            } else {
                $this.animOptions = $this.o.animations.pc;
            }

            // Fill up the this.n and correct the cloned notes as well
            $this.initNodeVariables();

            /**
             * Default animation opacity. 0 for IN types, 1 for all the other ones. This ensures the fluid
             * animation. Wrong opacity causes flashes.
             */
            $this.animationOpacity = $this.animOptions.items.indexOf("In") < 0 ? "opacityOne" : "opacityZero";

            $this.o.redirectOnClick = $this.o.trigger.click != 'ajax_search' && $this.o.trigger.click != 'nothing';
            $this.o.redirectOnEnter = $this.o.trigger.return != 'ajax_search' && $this.o.trigger.return != 'nothing';
            $this.usingLiveLoader = ($this.o.resPage.useAjax && $($this.o.resPage.selector).length > 0) || $('.asl_es_' + $this.o.id).length > 0;
            if ($this.usingLiveLoader) {
                $this.o.trigger.type = $this.o.resPage.trigger_type;
                $this.o.trigger.facet = $this.o.resPage.trigger_facet;
                if ($this.o.resPage.trigger_magnifier) {
                    $this.o.redirectOnClick = 0;
                    $this.o.trigger.click = 'ajax_search';
                }

                if ($this.o.resPage.trigger_return) {
                    $this.o.redirectOnEnter = 0;
                    $this.o.trigger.return = 'ajax_search';
                }
            }

            // Sets $this.dragging to true if the user is dragging on a touch device
            $this.monitorTouchMove();

            // Rest of the events
            $this.initEvents();

            // Auto populate
            $this.initAutop();

            // Etc stuff..
            $this.initEtc();

            // After the first execution, this stays false
            _static.firstIteration = false;

            // Init complete event trigger
            $this.n('s').trigger("asl_init_search_bar", [$this.o.id, $this.o.iid], true, true);

            return this;
        },

        n: function(k){
            if ( typeof this.nodes[k] !== 'undefined' ) {
                return this.nodes[k];
            } else {
                switch( k ) {
                    case 's':
                        this.nodes[k] = this.nodes.search;
                        break;
                    case 'container':
                        this.nodes[k] = this.nodes.search.closest('.asl_w_container');
                        break;
                    case 'searchsettings':
                        this.nodes[k] = $('.asl_s', this.n('container'));
                        break;
                    case 'resultsDiv':
                        this.nodes[k] = $('.asl_r', this.n('container'));
                        break;
                    case 'probox':
                        this.nodes[k] = $('.probox', this.nodes.search);
                        break;
                    case 'proinput':
                        this.nodes[k] = $('.proinput', this.nodes.search);
                        break;
                    case 'text':
                        this.nodes[k] = $('.proinput input.orig', this.nodes.search);
                        break;
                    case 'textAutocomplete':
                        this.nodes[k] = $('.proinput input.autocomplete', this.nodes.search);
                        break;
                    case 'proloading':
                        this.nodes[k] = $('.proloading', this.nodes.search);
                        break;
                    case 'proclose':
                        this.nodes[k] = $('.proclose', this.nodes.search);
                        break;
                    case 'promagnifier':
                        this.nodes[k] = $('.promagnifier', this.nodes.search);
                        break;
                    case 'prosettings':
                        this.nodes[k] = $('.prosettings', this.nodes.search);
                        break;
                    case 'settingsAppend':
                        this.nodes[k] = $('#wpdreams_asl_settings_' + this.o.id);
                        break;
                    case 'resultsAppend':
                        this.nodes[k] = $('#wpdreams_asl_results_' + this.o.id);
                        break;
                    case 'trythis':
                        this.nodes[k] = $("#asp-try-" + this.o.rid);
                        break;
                    case 'hiddenContainer':
                        this.nodes[k] = $('.asl_hidden_data', this.n('container'));
                        break;
                    case 'aspItemOverlay':
                        this.nodes[k] = $('.asl_item_overlay', this.n('hiddenContainer'));
                        break;
                    case 'showmore':
                        this.nodes[k] = $('.showmore', this.n('resultsDiv'));
                        break;
                    case 'items':
                        this.nodes[k] = $('.item', this.n('resultsDiv')).length > 0 ? $('.item', this.n('resultsDiv')) : $('.photostack-flip', this.n('resultsDiv'));
                        break;
                    case 'results':
                        this.nodes[k] = $('.results', this.n('resultsDiv'));
                        break;
                    case 'resdrg':
                        this.nodes[k] = $('.resdrg', this.n('resultsDiv'));
                        break;
                }
                return this.nodes[k];
            }
        },

        initNodeVariables: function(){
            let $this = this;

            $this.o.id = $this.nodes.search.data('id');
            $this.o.iid = $this.nodes.search.data('instance');
            $this.o.rid = $this.o.id + "_" + $this.o.iid;
            // Fix any potential clones and adjust the variables
            $this.fixClonedSelf();
        },


        initEvents: function () {
            this.initSettingsSwitchEvents?.();
            this.initOtherEvents();
            //this.initTryThisEvents();
            this.initMagnifierEvents();
            this.initInputEvents();
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);