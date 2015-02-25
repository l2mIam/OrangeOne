/**
 * Created by Kirsten on 2/24/2015.
 *
 * Graphical code for displaying the dialog box is stored here.
 */

// !! The global variable window.uwetech.dialog is assigned at the bottom.

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

    /**
     * Required variables: String first line of text, String second line of text.
     *                      Both restricted to xyz character length.
     * Optional variables: String representing the location of img to display
     *                      for dialog (usually an npc face)
     */
    this.show = function(first_line, second_line, npc_image_object) {
        isShown = true;
        dlgctx.drawImage(smallBox, 0, 0, smallBox.width, smallBox.height,
                                            0, 0,
                                        dlgcanvas.width, dlgcanvas.height);

        dlgctx.fillText(first_line, dlgcanvas.width / 20,
                    dlgcanvas.height - (dlgcanvas.height / 5));
        dlgctx.fillText(second_line, dlgcanvas.width / 20,
            dlgcanvas.height - (dlgcanvas.height / 8));

        if (npc_image_object) {
            /** var npc_image_object;
            if (typeof npc_image === "string") {
                npc_image_object = new Image();
                npc_image_object.src = npc_image;
            } else if (typeof npc_image === "object") {
                npc_image_object = npc_image;
            } */
            dlgctx.drawImage(npc_image_object, 0, 0, npc_image_object.width, npc_image_object.height,
                            0, dlgcanvas.height - ((dlgcanvas.height / 4) + npc_image_object.height / 1.5),
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