(function(){
    "use strict";

    const version = 1;

    window.WPD = typeof window.WPD !== 'undefined' ? window.WPD : {};

    if ( typeof WPD.dom != "undefined" ) {
        return false;	// Terminate
    }

    WPD.dom = function() {
        if ( typeof WPD.dom.fn == "undefined" || typeof WPD.dom.fn.a == "undefined") {
            WPD.dom.fn = {
                a: [],
                is_wpd_dom: true,
                length: 0,
                get: function (n) {
                    return typeof n == "undefined" ? this.a.slice() : (typeof this.a[n] != 'undefined' ? this.a[n] : null);
                },
                _: function (s) {
                    if ( s.charAt(0) === '<' ) {
                        return WPD.dom._fn.createElementsFromHTML(s);
                    }
                    return Array.prototype.slice.call(document.querySelectorAll(s));
                },
                $: function (s, $node) {
                    let _this = this.copy(this, true);
                    if ( typeof $node != "undefined" ) {
                        _this.a = $node !== null ? $node.find(s).get() : [];
                    } else {
                        if (typeof s == "string") {
                            _this.a = _this._(s);
                        } else {
                            _this.a = s!== null ? [s] : [];
                        }
                    }
                    _this.length = _this.a.length;
                    return _this;
                },
                extend: function () {
                    for (let i = 1; i < arguments.length; i++)
                        for (let key in arguments[i])
                            if (arguments[i].hasOwnProperty(key))
                                arguments[0][key] = arguments[i][key];
                    return arguments[0];
                },
                copy: function(source, deep) {
                    let o, prop, type;
                    if (typeof source != 'object' || source === null) {
                        // What do to with functions, throw an error?
                        o = source;
                        return o;
                    }
                    o = new source.constructor();
                    for (prop in source) {
                        if (source.hasOwnProperty(prop)) {
                            type = typeof source[prop];
                            if (deep && type === 'object' && source[prop] !== null) {
                                o[prop] = this.copy(source[prop]);
                            } else {
                                o[prop] = source[prop];
                            }
                        }
                    }
                    return o;
                },
                parent: function (s) {
                    let el = this.get(0);
                    let _this = this.copy(this, true);
                    _this.a = [];
                    if (el != null) {
                        el = el.parentElement;
                        if (typeof s != 'undefined') {
                            if (el.matches(s)) {
                                _this.a = [el];
                            }
                        } else {
                            _this.a = el == null ? [] : [el];
                        }
                        return _this;
                    }
                    return _this;
                },
                first: function () {
                    let _this = this.copy(this, true);
                    _this.a = typeof _this.a[0] != 'undefined' ? [_this.a[0]] : [];
                    _this.length = _this.a.length;
                    return _this;
                },
                last: function () {
                    let _this = this.copy(this, true);
                    _this.a = _this.a.length > 0 ? [_this.a[_this.a.length - 1]] : [];
                    _this.length = _this.a.length;
                    return _this;
                },
                prev: function (s) {
                    let _this = this.copy(this, true);
                    if ( typeof s == "undefined" ) {
                        _this.a = typeof _this.a[0] != 'undefined' && _this.a[0].previousElementSibling != null ?
                            [_this.a[0].previousElementSibling] : [];
                    } else {
                        if ( typeof _this.a[0] != 'undefined' ) {
                            let n = _this.a[0].previousElementSibling;
                            _this.a = [];
                            while ( n != null ) {
                                if ( n.matches(s) ) {
                                    _this.a = [n];
                                    break;
                                }
                                n = n.previousElementSibling;
                            }
                        }
                    }
                    _this.length = _this.a.length;
                    return _this;
                },
                next: function (s) {
                    let _this = this.copy(this, true);
                    if ( typeof s == "undefined" ) {
                        _this.a = typeof _this.a[0] != 'undefined' && _this.a[0].nextElementSibling != null ?
                            [_this.a[0].nextElementSibling] : [];
                    } else {
                        if ( typeof _this.a[0] != 'undefined' ) {
                            let n = _this.a[0].nextElementSibling;
                            _this.a = [];
                            while ( n != null ) {
                                if ( n.matches(s) ) {
                                    _this.a = [n];
                                    break;
                                }
                                n = n.nextElementSibling;
                            }
                        }
                    }
                    _this.length = _this.a.length;
                    return _this;
                },
                closest: function (s) {
                    let el = this.get(0);
                    let _this = this.copy(this, true);
                    _this.a = [];
                    if ( typeof s === "string" ) {
                        if (el !== null && typeof el.matches != 'undefined' && s !== '') {
                            if (!el.matches(s)) {
                                // noinspection StatementWithEmptyBodyJS
                                while ((el = el.parentElement) && !el.matches(s)) ;
                            }
                            _this.a = el == null ? [] : [el];
                        }
                    } else {
                        if (el !== null && typeof el.matches != 'undefined' && typeof s.matches != 'undefined') {
                            if ( el !== s ) {
                                // noinspection StatementWithEmptyBodyJS
                                while ((el = el.parentElement) && el !== s) ;
                            }
                            _this.a = el == null ? [] : [el];
                        }
                    }
                    _this.length = _this.a.length;
                    return _this;
                },
                add: function( el ) {
                    if ( typeof el !== "undefined" ) {
                        if (typeof el.nodeType !== "undefined") {
                            if (this.a.indexOf(el) == -1) {
                                this.a.push(el);
                            }
                        } else if (typeof el.a !== "undefined") {
                            let _this = this;
                            el.a.forEach(function (el) {
                                if (_this.a.indexOf(el) == -1) {
                                    _this.a.push(el);
                                }
                            });
                        }
                    }
                    return this;
                },
                find: function (s) {
                    let _this = this.copy(this, true);
                    _this.a = [];
                    this.forEach(function(el){
                        if ( el !== null && typeof el.querySelectorAll != 'undefined') {
                            _this.a = _this.a.concat(Array.prototype.slice.call(el.querySelectorAll(s)));
                        }
                    });
                    _this.length = _this.a.length;
                    return _this;
                },
                forEach: function (callback) {
                    this.a.forEach(function (node, index, array) {
                        callback.apply(node, [node, index, array]);
                    });
                    return this;
                },
                each: function (c) {
                    return this.forEach(c);
                },
                hasClass: function (c) {
                    let el = this.get(0);
                    return el != null ? el.classList.contains(c) : false;
                },
                addClass: function (c) {
                    let args = c;
                    if (typeof c == 'string') {
                        args = c.split(' ');
                    }
                    args = args.filter(function (i) {
                        return i.trim() !== ''
                    });
                    if (args.length > 0) {
                        this.forEach(function (el) {
                            el.classList.add.apply(el.classList, args);
                        });
                    }
                    return this;
                },
                removeClass: function (c) {
                    if ( typeof c != 'undefined' ) {
                        let args = c;
                        if (typeof c == 'string') {
                            args = c.split(' ');
                        }
                        args = args.filter(function (i) {
                            return i.trim() !== ''
                        });
                        if (args.length > 0) {
                            this.forEach(function (el) {
                                el.classList.remove.apply(el.classList, args);
                            });
                        }
                    } else {
                        this.forEach(function (el) {
                            if ( el.classList.length > 0 ) {
                                el.classList.remove.apply(el.classList, el.classList);
                            }
                        });
                    }
                    return this;
                },
                is: function(s){
                    let el = this.get(0);
                    if ( el != null ) {
                        return el.matches(s);
                    }
                    return false;
                },
                val: function(v) {
                    let el = this.get(0);
                    if ( el != null ) {
                        if (arguments.length == 1) {
                            if ( el.type == 'select-multiple' ) {
                                v = typeof v === 'string' ? v.split(',') : v;
                                for ( let i = 0, l = el.options.length, o; i < l; i++ ) {
                                    o = el.options[i];
                                    o.selected = v.indexOf(o.value) != -1;
                                }
                            } else {
                                el.value = v;
                            }
                        } else {
                            if ( el.type == 'select-multiple' ) {
                                return Array.prototype.map.call(el.selectedOptions, function(x){ return x.value });
                            } else {
                                return el.value;
                            }
                        }
                    }
                    return this;
                },
                isVisible: function() {
                    let el = this.get(0), visible = true, style;
                    while (el !== null) {
                        style = window.getComputedStyle(el);
                        if (
                            style['display'] == 'none' ||
                            style['visibility'] == 'hidden' ||
                            style['opacity'] == 0
                        ) {
                            visible = false;
                            break;
                        }
                        el = el.parentElement;
                    }
                    return visible;
                },
                attr: function (a, v) {
                    let ret, args = arguments, _this = this;
                    this.forEach(function(el) {
                        if ( args.length == 2 ) {
                            el.setAttribute(a, v);
                            ret = _this;
                        } else {
                            if ( typeof a === 'object' ) {
                                Object.keys(a).forEach(function(k){
                                    el.setAttribute(k, a[k]);
                                });
                            } else {
                                ret = el.getAttribute(a);
                            }
                        }
                    });
                    return ret;
                },
                removeAttr: function(a) {
                    this.forEach(function(el) {
                        el.removeAttribute(a);
                    });
                    return this;
                },
                prop: function(a, v) {
                    let ret, args = arguments;
                    this.forEach(function(el) {
                        if ( args.length == 2 ) {
                            el[a] = v;
                        } else {
                            ret = typeof el[a] != "undefined" ? el[a] : null;
                        }
                    });
                    if ( args.length == 2 ) {
                        return this;
                    } else {
                        return ret;
                    }
                },
                data: function(d, v) {
                    let el = this.get(0),
                        s = d.replace(/-([a-z])/g, function (g) {
                        return g[1].toUpperCase();
                    });
                    if ( el != null ) {
                        if ( arguments.length == 2 ) {
                            el.dataset[s] = v;
                            return this;
                        } else {
                            return typeof el.dataset[s] == "undefined" ? '' : el.dataset[s];
                        }
                    }
                    return '';
                },
                html: function(v) {
                    let el = this.get(0);
                    if ( el != null ) {
                        if ( arguments.length == 1 ) {
                            el.innerHTML = v;
                            return this;
                        } else {
                            return el.innerHTML;
                        }
                    }
                    return '';
                },
                text: function(v) {
                    let el = this.get(0);
                    if ( el != null ) {
                        if ( arguments.length == 1 ) {
                            el.textContent = v;
                            return this;
                        } else {
                            return el.textContent;
                        }
                    }
                    return '';
                },
                css: function(prop, v) {
                    let els = this.get(), el;
                    for (let i=0; i<els.length; i++) {
                        el = els[i];
                        if ( arguments.length == 1 ) {
                            if ( typeof prop == "object" ) {
                                Object.keys(prop).forEach(function(k){
                                    el.style[k] = prop[k];
                                });
                            } else {
                                return window.getComputedStyle(el)[prop];
                            }
                        } else {
                            el.style[prop] = v;
                        }
                    }
                    return this;
                },
                position: function() {
                    let el = this.get(0);
                    if ( el != null ) {
                        return {'top': el.offsetTop, 'left': el.offsetLeft};
                    } else {
                        return {'top': 0, 'left': 0};
                    }
                },
                offset: function() {
                    let el = this.get(0);
                    if ( el != null ) {
                        if ( WPD.dom._fn.hasFixedParent(el) ) {
                            return el.getBoundingClientRect();
                        } else {
                            return WPD.dom._fn.absolutePosition(el);
                        }
                    } else {
                        return {'top': 0, 'left': 0};
                    }
                },
                outerWidth: function(margin) {
                    margin = margin || false;
                    let el = this.get(0);
                    if ( el != null ) {
                        return !margin ? parseInt( el.offsetWidth ) :
                            (
                                parseInt( el.offsetWidth ) +
                                parseInt( this.css('marginLeft') ) +
                                parseInt( this.css('marginRight') )
                            );
                    }
                },
                outerHeight: function(margin) {
                    margin = margin || false;
                    return !margin ? parseInt( this.css('height') ) :
                        (
                            parseInt( this.css('height') ) +
                            parseInt( this.css('marginTop') ) +
                            parseInt( this.css('marginBottom') )
                        );
                },
                innerWidth: function() {
                    let el = this.get(0);
                    if ( el != null ) {
                        let cs = window.getComputedStyle(el);
                        return this.outerWidth() - parseFloat(cs.borderLeftWidth) - parseFloat(cs.borderRightWidth);
                    }
                    return 0;
                },
                width: function() {
                    return this.outerWidth();
                },
                height: function() {
                    return this.outerHeight();
                },
                on: function() {
                    let args = arguments,
                        func = function(args, e) {
                            let $el;
                            if ( e.type == 'mouseenter' || e.type == 'mouseleave' || e.type == 'hover' ) {
                                let el = document.elementFromPoint(e.clientX, e.clientY);
                                if ( !el.matches(args[1]) ) {
                                    // noinspection StatementWithEmptyBodyJS
                                    while ((el = el.parentElement) && !el.matches(args[1])) ;
                                }
                                if ( el != null ) {
                                    $el = WPD.dom(el);
                                }
                            } else {
                                $el = WPD.dom(e.target).closest(args[1]);
                            }
                            if (
                                $el != null &&
                                $el.closest(this).length > 0
                            ){
                                let argd = [];
                                argd.push(e);
                                if ( typeof args[4] != 'undefined' ) {
                                    for (let i=4; i<args.length; i++) {
                                        argd.push(args[i]);
                                    }
                                }
                                args[2].apply($el.get(0), argd);
                            }
                        };
                    let events = args[0].split(' ');
                    for (let i=0;i<events.length;i++) {
                        let type = events[i];
                        if ( typeof args[1] == "string" ) {
                            this.forEach(function(el){
                                if ( !WPD.dom._fn.hasEventListener(el, type, args[2]) ) {
                                    let f = func.bind(el, args);
                                    el.addEventListener(type, f, args[3]);
                                    // Store the trigger in the selected elements, not the parent node
                                    el._wpd_el = typeof el._wpd_el == "undefined" ? [] : el._wpd_el;
                                    el._wpd_el.push({
                                        'type': type,
                                        'selector': args[1],
                                        'func': f,  // The bound function called by the event listener
                                        'trigger': args[2], // The function within the bound function, used in this.trigger(..)
                                        'args': args[3]
                                    });
                                }
                            });
                        } else {
                            for (let i=0;i<events.length;i++) {
                                let type = events[i];
                                this.forEach(function (el) {
                                    if ( !WPD.dom._fn.hasEventListener(el, type, args[1]) ) {
                                        el.addEventListener(type, args[1], args[2]);
                                        el._wpd_el = typeof el._wpd_el == "undefined" ? [] : el._wpd_el;
                                        el._wpd_el.push({
                                            'type': type,
                                            'func': args[1],
                                            'trigger': args[1],
                                            'args': args[2]
                                        });
                                    }
                                });
                            }
                        }
                    }
                    return this;
                },
                off: function(listen, callback) {
                    this.forEach(function (el) {
                        if ( typeof el._wpd_el != "undefined" && el._wpd_el.length > 0 ) {
                            if ( typeof listen === 'undefined' ) {
                                let cb;
                                while (cb = el._wpd_el.pop()) {
                                    el.removeEventListener(cb.type, cb.func, cb.args);
                                }
                                el._wpd_el = [];
                            } else {
                                listen.split(' ').forEach(function(type){
                                    if (typeof callback == "undefined") {
                                        let cb;
                                        while (cb = el._wpd_el.pop()) {
                                            el.removeEventListener(type, cb.func, cb.args);
                                        }
                                        el._wpd_el = [];
                                    } else {
                                        let remains = [];
                                        el._wpd_el.forEach(function(cb){
                                            if ( cb.type == type && cb.trigger == callback ) {
                                                el.removeEventListener(type, cb.func, cb.args);
                                            } else {
                                                remains.push(cb);
                                            }
                                        });
                                        el._wpd_el = remains;
                                    }
                                });
                            }
                        }
                    });
                    return this;
                },
                offForced: function(){
                    let _this = this;
                    this.forEach(function(el, i){
                        let ne = el.cloneNode(true);
                        el.parentNode.replaceChild(ne, el);
                        _this.a[i] = ne;
                    });
                    return this;
                },
                trigger: function(type, args, native ,jquery) {
                    native = native || false;
                    jquery = jquery || false;
                    this.forEach(function(el){
                        let triggered = false;
                        // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                        if (
                            jquery &&
                            typeof jQuery != "undefined" &&
                            typeof jQuery._data != 'undefined' &&
                            typeof jQuery._data(el, 'events') != 'undefined' &&
                            typeof jQuery._data(el, 'events')[type] != 'undefined'
                        ) {
                            // noinspection JSUnresolvedVariable,JSUnresolvedFunction
                            jQuery(el).trigger(type, args);
                            triggered = true;
                        }
                        if ( !triggered && native ) {
                            // Native event handler
                            let event = new Event(type);
                            event.detail = args;
                            el.dispatchEvent(event);
                        }

                        if (typeof el._wpd_el != "undefined") {
                            // Case 1, regularly attached
                            el._wpd_el.forEach(function(data){
                                if ( data.type == type ) {
                                    let event = new Event(type);
                                    data.trigger.apply(el, [event].concat(args));
                                }
                            });
                        } else {
                            // Case 2, attached to a selector: $elem.on('click', 'selector'...
                            let found = false, p = el;
                            // Find parents, where event infomration is stored
                            while ( true ) {
                                p = p.parentElement;
                                if ( p == null ) {
                                    break;
                                }
                                if (typeof p._wpd_el != "undefined") {
                                    p._wpd_el.forEach(function(data){
                                        if ( typeof data.selector !== "undefined" ) {
                                            let targets = WPD.dom(p).find(data.selector);
                                            if (
                                                targets.length > 0 &&
                                                targets.get().indexOf(el) >=0 &&
                                                data.type == type
                                            ) {
                                                let event = new Event(type);
                                                data.trigger.apply(el, [event].concat(args));
                                                found = true;
                                            }
                                        }
                                    });
                                }
                                if ( found ) {
                                    break;
                                }
                            }
                        }
                    });
                    return this;
                },
                clone: function() {
                    let el = this.get(0);
                    if ( el != null ) {
                        this.a = [el.cloneNode(true)];
                        this.length = this.a.length;
                    } else {
                        this.a = [];
                    }
                    this.length = this.a.length;
                    return this;
                },
                remove: function(elem) {
                    if ( typeof elem != "undefined" ) {
                        return elem.parentElement.removeChild(elem);
                    } else {
                        this.forEach(function(el) {
                            if ( el.parentElement != null ) {
                                return el.parentElement.removeChild(el);
                            }
                        });
                        this.a = [];
                        this.length = this.a.length;
                        return null;
                    }
                },
                detach: function() {
                    let _this = this, n = [];
                    this.forEach(function(elem){
                        let el = _this.remove(elem);
                        if ( el != null ) {
                            n.push(el)
                        }
                    });
                    this.a = n;
                    this.length = this.a.length;
                    return this;
                },
                prepend: function(prepend) {
                    if ( typeof prepend == 'string' ) {
                        prepend = WPD.dom._fn.createElementsFromHTML(prepend);
                    }
                    prepend = Array.isArray(prepend) ? prepend : [prepend];
                    this.forEach(function(el){
                        prepend.forEach(function(pre){
                            if ( typeof pre.is_wpd_dom != 'undefined' ) {
                                pre.forEach(function(pr){
                                    el.insertBefore(pr, el.children[0]);
                                });
                            } else {
                                el.insertBefore(pre, el.children[0]);
                            }
                        });
                    });
                    return this;
                },
                append: function(append) {
                    if ( typeof append == 'string' ) {
                        append = WPD.dom._fn.createElementsFromHTML(append);
                    }
                    append = Array.isArray(append) ? append : [append];
                    this.forEach(function(el){
                        append.forEach(function(app) {
                            if ( app != null ) {
                                if (typeof app.is_wpd_dom != 'undefined') {
                                    app.forEach(function (ap) {
                                        el.appendChild(ap);
                                    });
                                } else {
                                    el.appendChild(app.cloneNode(true));
                                }
                            }
                        });
                    });
                    return this;
                },
                uuidv4: function() {
                    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        let r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                        return v.toString(16);
                    });
                }
            }
            WPD.dom._fn = {
                bodyTransform: function() {
                    let x = 0, y = 0;
                    if ( typeof WebKitCSSMatrix !== 'undefined' ) {
                        let style = window.getComputedStyle(document.body);
                        if ( typeof style.transform != 'undefined' ) {
                            let matrix = new WebKitCSSMatrix(style.transform);
                            if ( matrix.m41 != 'undefined' ) {
                                x = matrix.m41;
                            }
                            if ( matrix.m42 != 'undefined' ) {
                                y = matrix.m42;
                            }
                        }
                    }

                    return {x: x, y: y};
                },
                bodyTransformY: function() {
                    return this.bodyTransform().y;
                },
                bodyTransformX: function() {
                    return this.bodyTransform().x;
                },
                hasFixedParent: function(el) {
                    /**
                     * When CSS transform is present, then Fixed element are no longer fixed
                     * even if the CSS declaration says.
                     */
                    if ( WPD.dom._fn.bodyTransformY() != 0 ) {
                        return false;
                    }
                    do {
                        if ( window.getComputedStyle(el)['position'] == 'fixed' ) {
                            return true;
                        }
                    } while( el = el.parentElement );
                    return false;
                },

                hasEventListener: function(el, type, trigger) {
                    if (typeof el._wpd_el == "undefined") {
                        return false;
                    }
                    for (let i = 0; i < el._wpd_el.length; i++) {
                        if ( el._wpd_el[i].trigger == trigger && el._wpd_el[i].type == type ) {
                            return true;
                        }
                    }
                    return false;
                },

                allDescendants: function(node) {
                    let nodes = [], _this = this;
                    if ( !Array.isArray(node) ) {
                        node = [node];
                    }
                    node.forEach( function(n){
                        for (let i = 0; i < n.childNodes.length; i++) {
                            let child = n.childNodes[i];
                            nodes.push(child);
                            nodes = nodes.concat(_this.allDescendants(child));
                        }
                    });
                    return nodes;
                },

                createElementsFromHTML: function(htmlString) {
                    let template = document.createElement('template');
                    template.innerHTML = htmlString.replace(/(\r\n|\n|\r)/gm, "");
                    return Array.prototype.slice.call(template.content.childNodes);
                },

                absolutePosition: function(el) {
                    if ( !el.getClientRects().length ) {
                        return { top: 0, left: 0 };
                    }

                    let rect = el.getBoundingClientRect();
                    let win = el.ownerDocument.defaultView;
                    return ({
                        top: rect.top + win.pageYOffset,
                        left: rect.left + win.pageXOffset
                    });
                },

                // Create a plugin based on a defined object
                plugin: function (name, object) {
                    WPD.dom.fn[name] = function (options) {
                        if ( typeof(options) != 'undefined' && object[options] ) {
                            return object[options].apply( this, Array.prototype.slice.call( arguments, 1 ));
                        } else {
                            return this.each(function (elem) {
                                elem['wpd_dom_' + name] = Object.create(object).init(options, elem);
                            });
                        }

                    };
                }
            }

            WPD.dom.version = version;
        }

        if ( arguments.length >= 1 ) {
            return WPD.dom.fn.$.apply(WPD.dom.fn, arguments);
        } else {
            return WPD.dom.fn;
        }
    };
    WPD.dom();
    document.dispatchEvent(new Event('wpd-dom-core-loaded'));
}());