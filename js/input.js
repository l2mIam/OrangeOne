/**
 * Created by Kirsten on 2/11/2015. Adds input functionality to the game.
 *

 */

window.uwetech.Input = (function () {
    var keys = {};

    window.addEventListener('keydown', function (e) {
        keys[e.keyCode] = true;

    });
    window.addEventListener('keyup', function (e) {
        delete keys[e.keyCode];
    });

    return {
        keys : keys
    };
}());
