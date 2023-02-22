window.WPD = window.WPD || {};
/**
 * Checks "criteria" until not false, then executes function "f". No delay on first execution, like with simple
 * setInterval().
 * @param f
 * @param criteria Function or variable reference - preferably function
 * @param interval
 * @param maxTries
 * @returns {*}
 */
window.WPD.intervalUntilExecute = function(f, criteria, interval, maxTries) {
    let t, tries = 0,
        res = typeof criteria === "function" ? criteria() : criteria;
    interval = typeof interval == "undefined" ? 100 : interval;
    maxTries = typeof maxTries == "undefined" ? 50 : maxTries;

    if ( res === false ) {
        t = setInterval(function (){
            res = typeof criteria === "function" ? criteria() : criteria;
            tries++;
            if ( tries > maxTries ) {
                clearInterval(t);
                return false;
            }
            if ( res !== false ) {
                clearInterval(t);
                return f(res);
            }
        }, interval)
    } else {
        return f(res);
    }
};