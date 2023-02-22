(function($){
    "use strict";
    let helpers = window.WPD.ajaxsearchlite.helpers;
    let functions = {
        /**
         * This function should be called on-demand to init the results events and all. Do not call on init, only when needed.
         */
        initResults: function() {
            if ( !this.resultsInitialized ) {
                this.initResultsBox();
                this.initResultsEvents();
                this.initNavigationEvents?.();
            }
        },
        initResultsBox: function() {
            let $this = this;

            // Calculates the results animation attributes
            $this.initResultsAnimations();

            if ( helpers.isMobile() && $this.o.mobile.force_res_hover == 1) {
                $this.o.resultsposition = 'hover';
                //$('body').append($thisn('resultsDiv').detach());
                $this.nodes.resultsDiv = $this.n('resultsDiv').clone();
                $('body').append($this.nodes.resultsDiv);
                $this.nodes.resultsDiv.css({
                    'position': 'absolute'
                });
                $this.detectAndFixFixedPositioning();
            } else {
                // Move the results div to the correct position
                if ($this.o.resultsposition == 'hover' && $this.n('resultsAppend').length <= 0) {
                    $this.nodes.resultsDiv = $this.n('resultsDiv').clone();
                    $('body').append($this.n('resultsDiv'));
                } else  {
                    $this.o.resultsposition = 'block';
                    $this.n('resultsDiv').css({
                        'position': 'static'
                    });
                    if ( $this.n('resultsAppend').length > 0  ) {
                        if ( $this.n('resultsAppend').find('.asl_w').length > 0 ) {
                            $this.nodes.resultsDiv = $this.n('resultsAppend').find('.asl_w');
                        } else {
                            $this.nodes.resultsDiv = $this.n('resultsDiv').clone();
                            $this.nodes.resultsAppend.append($this.n('resultsDiv'));
                        }
                    }
                }
            }

            $this.nodes.showmore = $('.showmore', $this.n('resultsDiv'));
            $this.nodes.items = $('.item', $this.n('resultsDiv')).length > 0 ? $('.item', $this.n('resultsDiv')) : $('.photostack-flip', $this.n('resultsDiv'));
            $this.nodes.results = $('.results', $this.n('resultsDiv'));
            $this.nodes.resdrg = $('.resdrg', $this.n('resultsDiv'));

            $this.n('resultsDiv').get(0).id = $this.n('resultsDiv').get(0).id.replace('__original__', '');
            $this.detectAndFixFixedPositioning();

            $this.resultsInitialized = true;
        },

        initResultsAnimations: function() {
            let $this = this,
                animDur = 300;

            $this.resAnim = {
                "showClass": "asl_an_fadeInDrop",
                "showCSS": {
                    "visibility": "visible",
                    "display": "block",
                    "opacity": 1,
                    "animation-duration": animDur  + 'ms'
                },
                "hideClass": "asl_an_fadeOutDrop",
                "hideCSS": {
                    "visibility": "hidden",
                    "opacity": 0,
                    "display": "none"
                },
                "duration": animDur
            };

            $this.n('resultsDiv').css({
                "-webkit-animation-duration": animDur + "ms",
                "animation-duration": animDur + "ms"
            });
        }
    }
    $.fn.extend(window.WPD.ajaxsearchlite.plugin, functions);
})(WPD.dom);