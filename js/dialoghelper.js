/**
 * Created by Kirsten on 2/24/2015.
 *
 * Graphical code for displaying the dialog box is stored here.
 */

// !! The global variable window.uwetech.dialog is assigned at the bottom.

var Dialog = function () {

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

    /**
     * Shows a dialog box with the string passed (word wrapped at 75 characters!)
     * and optionally an npc Image() object.
     * @param string_of_text The text to be displayed. Auto-word wrapped at 75 characters.
     * @param npc_image_object Optional. Displays the passed Image() object (npc face).
     */
    this.show = function(string_of_text, npc_image_object) {
        if (isShown === true) {
            // Clear out the currently displayed text first!
            dlgctx.clearRect(0, 0, dlgcanvas.width, dlgcanvas.height);
        }

        isShown = true;
        dlgctx.drawImage(smallBox, 0, 0, smallBox.width, smallBox.height,
                                            0, 0,
                                        dlgcanvas.width, dlgcanvas.height);

        if (string_of_text !== undefined) {

            //var brk = '~';
            //var width = 75;
            //var cut = false;
            //
            //var regex = '.{1,' + width + '}(\s|$)' + (cut ? '|.{' + width + '}|.+$' : '|(\S+)?(\s|$)');
            //
            //console.log(string_of_text.match(RegExp(regex, 'g')));
            //var wordwrap = string_of_text.match(RegExp(regex, 'g')).join(brk);
            //console.log(wordwrap);

            var wordwrap = string_of_text.wordWrap(75, '~', 3);
            var lines = wordwrap.split("~");

            for (var i = 0; i < lines.length && i < 4; i++) {
                dlgctx.fillText(lines[i], dlgcanvas.width / 22,
                    (i * 18) + dlgcanvas.height - (dlgcanvas.height / 5 ) - 3);
            }
        } else {
            console.log('Usage: dialog.show("Text to display")');
        }
        //
        //dlgctx.fillText(string_of_text, dlgcanvas.width / 20,
        //            dlgcanvas.height - (dlgcanvas.height / 5));
        //dlgctx.fillText(string_of_text, dlgcanvas.width / 20,
        //    dlgcanvas.height - (dlgcanvas.height / 8));

        if (npc_image_object !== undefined) {
            /** var npc_image_object;
            if (typeof npc_image === "string") {
                npc_image_object = new Image();
                npc_image_object.src = npc_image;
            } else if (typeof npc_image === "object") {
                npc_image_object = npc_image;
            } */
            dlgctx.drawImage(npc_image_object, 0, 0, npc_image_object.width, npc_image_object.height,
                0 + 15, dlgcanvas.height - 12 - ((dlgcanvas.height / 4) + npc_image_object.height / 1.5),
                npc_image_object.width / 1.5, npc_image_object.height / 1.5);
        }
    };

    /** Stops displaying the dialog. Has no effect if no dialog is being displayed. */
    this.hide = function () {
        isShown = false;
        dlgctx.clearRect(0, 0, dlgcanvas.width, dlgcanvas.height);
        //hide();
    };

    /** Testing code! Wheee! Kirsten says fun stuff is usually commented out. */
    //console.log("will it load?");
    //smallBox.onload = function () {
    //    that.show("happy");
    //    console.log("smallBox loaded!");
    //};
    //this.show("happy");

};


/** Attach a new Dialog object to the global variable for other javascript files. */
window.uwetech.dialog = new Dialog();


//var show = function (first_line, second_line, npc_face) {
//
//
//};
//
//var hide = function () {
//
//};