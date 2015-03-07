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


var mouse_canvas = document.getElementById('mouselayer');
    //mouse_ctx = mouse_canvas.getContext('2d');

window.uwetech.Input.getMousePos = function(evt) {

    var mouse_rect = mouse_canvas.getBoundingClientRect();
    var transX = mouse_canvas.width / mouse_rect.width;
    var transY = mouse_canvas.height / mouse_rect.height;

    return {
        // client position is in actual pixels on the client
        // canvas may be stretched.
        // need to convert coordinates to canvas dimensions
        x: Math.floor((evt.clientX - mouse_rect.left) * transX),
        y: Math.floor((evt.clientY - mouse_rect.top)  * transY)
    };
};

mouse_canvas.addEventListener('mousedown', function(evt) {
    //console.log("mouse down!");
    g.handleMouseDown(window.uwetech.Input.getMousePos(evt));
});