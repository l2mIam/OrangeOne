/**
 * Created by Kirsten on 2/24/2015.
 *
 * Graphical code for displaying the dialog box is stored here.
 */

// !! The global variable window.uwetech.dialog is assigned at the bottom.

// Tired of typing window before console, so binding it explicitly.
var console = window.console;

var Dialog = function () {

    /** Setup Dialog variables~~ */
    var that = this, // because javascript is weird
        isShown = false,
        dlgcanvas = document.getElementById('dialoglayer'),
        dlgctx = dlgcanvas.getContext('2d'),
        smallBox = new Image();
    smallBox.src = './img/OverlayDialogSmall.png';
    dlgctx.font = "bold 16px sans-serif";
    //var myFont = new Font();
    //myFont.fontFamily = "Indie Flower OFL";
    //myFont.src = "./fonts/IndieFlower.ttf";
    //myFont.format = "bold";
    //dlgctx.font = myFont;

    /** Stops displaying the dialog. Has no effect if no dialog is being displayed. */
    this.hide = function () {
        isShown = false;
        clearDialogCanvas();
    };

    /**
     * Shows a dialog box with the string passed (word wrapped at 75 characters!)
     * and optionally an npc Image() object (aligned to the left).
     * @param string_of_text The text to be displayed. Auto-word wrapped at 75 characters.
     * @param npc_image_object Optional. Displays the passed Image() object (npc face).
     */
    this.show = function(string_of_text, npc_image_object) {
        var position = "left";
        if (isShown === true) {
            clearDialogCanvas(); // clear any previous dialog being displayed
        }

        isShown = true;
        displaySmallBox(); // draw OverLayDialogSmall.png to dialog canvas

        if (string_of_text !== undefined) { // a string was passed
           writeText(string_of_text); // write the string to dialog canvas
        } else {
            // Report an error! No arguments were passed.
            console.log('Usage: dialog.show("Text to display")');
        }

        if (npc_image_object !== undefined) { // an image object was passed
            drawPortrait(npc_image_object, position); // draw portrait to dialog canvas
        }
    };

    /**
     * Shows a dialog box with the string passed (word wrapped at 75 characters!)
     * and optionally an npc Image() object (aligned to the right).
     * @param string_of_text The text to be displayed. Auto-word wrapped at 75 characters.
     * @param npc_image_object Optional. Displays the passed Image() object (npc face).
     */
    this.showRight = function(string_of_text, npc_image_object) {
        var position = "right";
        if (isShown === true) {
            clearDialogCanvas(); // clear any previous dialog being displayed
        }

        isShown = true;
        displaySmallBox(); // draw OverLayDialogSmall.png to dialog canvas

        if (string_of_text !== undefined) { // a string was passed
            writeText(string_of_text); // write the string to dialog canvas
        } else {
            // Report an error! No arguments were passed.
            console.log('Usage: dialog.show("Text to display")');
        }

        if (npc_image_object !== undefined) { // an image object was passed
            drawPortrait(npc_image_object, position); // draw portrait to dialog canvas
        }
    };

    /**
     * Creates a function that calls showRight(text, image);
     */
    this.createShowRight = function (text, image) {
        return function () {
            window.uwetech.dialog.showRight(text, image);
        };
    };

    /**
     * Creates a function that calls show(text, image);
     */
    this.createShow = function (text, image) {
        return function () {
            window.uwetech.dialog.show(text, image);
        };
    };

    /**
     * Inner Helper Functions. Not callable from outside the function!
     */
    var clearDialogCanvas = function () {
        dlgctx.clearRect(0, 0, dlgcanvas.width, dlgcanvas.height);
    };

    var displaySmallBox = function () {
        dlgctx.drawImage(smallBox, 0, 0, smallBox.width, smallBox.height,
            0, 0, dlgcanvas.width, dlgcanvas.height);
    };

    var writeText = function (string_of_text) {
        // break the string down into lines.
        var wordwrap = string_of_text.wordWrap(75, '~', 3);
        var lines = wordwrap.split("~");

        // display the lines (up to 4 displayed)
        for (var i = 0; i < lines.length && i < 4; i++) {
            dlgctx.fillText(lines[i], dlgcanvas.width / 22,
                (i * 18) + dlgcanvas.height - (dlgcanvas.height / 5 ) - 3);
        }
    };

    var drawPortrait = function (npc_image_object, position) {
        var x_offset = 0;

        if (position !== undefined) {
            if (position === "left") {
                x_offset = 20;
            } else if (position === "right") {
                x_offset = dlgcanvas.width - 20 - npc_image_object.width / 1.5;
            }

            dlgctx.drawImage(npc_image_object, 0, 0, npc_image_object.width, npc_image_object.height,
                x_offset, dlgcanvas.height - 12 - ((dlgcanvas.height / 4) + npc_image_object.height / 1.5),
                npc_image_object.width / 1.5, npc_image_object.height / 1.5);

        } else {
            // Report error and draw nothing.
            console.log("No position was passed to drawPortrait!");
        }

    };

};


/** Attach a new Dialog object to the global variable for other javascript files. */
window.uwetech.dialog = new Dialog();

// Adds a wordWrap function to the String prototype.
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/string/wordwrap [rev. #2]
/**
 *String.wordWrap(maxLength: Integer, [breakWith: String = "\n"],
 * [cutType: Integer = 0]): String
 *
 Returns an string with the extra characters/words "broken".
 maxLength maximum amount of characters per line
 breakWtih string that will be added whenever it's needed to break the line
 cutType
 0 = words longer than "maxLength" will not be broken
 1 = words will be broken when needed
 2 = any word that trespass the limit will be broken
 *
 */
String.prototype.wordWrap = function(max_length, break_with, cut_type){
    var i, j, l, s, r;
    if(max_length < 1)
        return this;
    for(i = -1, l = (r = this.split("\n")).length; ++i < l; r[i] += s) {
        for (s = r[i], r[i] = ""; s.length > max_length;
             r[i] += s.slice(0, j) + ((s = s.slice(j)).length ? break_with : "")) {
            j = cut_type == 2 || (j = s.slice(0, max_length + 1).match(/\S*(\s)?$/))[1] ?
                max_length : j.input.length - j[0].length ||
            cut_type == 1 && max_length || j.input.length +
            (j = s.slice(max_length).match(/^\S*/)).input.length;
        }
    }
    return r.join("\n");
};
