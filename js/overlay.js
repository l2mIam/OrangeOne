/**
 * Started by Kirsten.
 */
// shim layer with setTimeout fallback
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame    ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

var canvas = document.getElementsByName('canvas');
var ctx = canvas.getContext('2d');

/* Listen for key presses */
var keys = {};
window.addEventListener('keydown', function (e) {
    keys[e.keyCode] = true;
    Button.render();
});
window.addEventListener('keyup', function (e) {
    delete keys[e.keyCode];
    Button.render();
});

/* Create and display Button */
var Button = function () {
    this.load = false;
    this.imgX = 0;

    this.info = function (src, srcX, srcY, dtx, dty, x, y, width, height, key) {
        this.srcX = srcX;
        this.srcY = srcY;
        this.dtx = dtx;
        this.dty = dty;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.image = new Image();
        this.image.src = src;
        this.key = key;
        this.isPressed = false;

        this.render = function () {

            if (this.key in keys) {
                isPressed = true;
                this.dty = 66;
            } else {
                isPressed = false;
                this.dty = 0;
            }

            ctx.drawImage(this.image, this.srcX, this.srcY, this.dtx, this.dty, this.x, this.y, this.width, this.height);
        };
    };
};

// src, srcX, srcY, dtx, dty, x, y, width, height, key
var upArrow = new Button();
upArrow.info("./arrows.png", 132, 0, 66, 66, 300, 300, 64, 64, 87);
var downArrow = new Button();
downArrows.info("./arrows.png", 198, 0, 66, 66, 366, 366, 64, 64, 83);


upArrow.image.onload = function () {
    upArrow.load = true;
};

downArrow.image.onload = function () {
    downArrow.load = true;
};

