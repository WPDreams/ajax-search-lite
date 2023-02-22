window.ASL = typeof window.ASL !== 'undefined' ? window.ASL : {};
window.ASL.api = (function() {
    "use strict";
    let a4 = function(id, instance, func, args) {
        let s = ASL.instances.get(id, instance);
        return s !== false && s[func].apply(s, [args]);
    },
    a3 = function(id, func, args) {
        let s;
        if ( !isNaN(parseFloat(func)) && isFinite(func) ) {
            s = ASL.instances.get(id, func);
            return s !== false && s[args].apply(s);
        } else {
            s = ASL.instances.get(id);
            return s !== false && s.forEach(function(i){
                i[func].apply(i, [args]);
            });
        }
    },
    a2 = function(id, func) {
        let s;
        if ( func == 'exists' ) {
            return ASL.instances.exist(id);
        }
        s = ASL.instances.get(id);
        return s !== false && s.forEach(function(i){
            i[func].apply(i);
        });
    };
    if ( arguments.length == 4 ){
        return(
            a4.apply( this, arguments )
        );
    } else if ( arguments.length == 3 ) {
        return(
            a3.apply( this, arguments )
        );
    } else if ( arguments.length == 2 ) {
        return(
            a2.apply( this, arguments )
        );
    } else if ( arguments.length == 0 ) {
        console.log("Usage: ASL.api(id, [optional]instance, function, [optional]args);");
        console.log("For more info: https://knowledgebase.ajaxsearchlite.com/other/javascript-api");
    }
});