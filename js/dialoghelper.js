/**
 * Created by Kirsten on 2/24/2015.
 *
 * Graphical code for displaying the dialog box is stored here.
 */

// Attach a new Dialog object to the global variable for other javascript files.
window.uwetech.dialog = new Dialog();

function Dialog () {

    /**
     * Required variables: String first line of text, String second line of text. Both restricted to xyz character length.
     * Optional variables: String representing the location of img to display for dialog (usually an npc face)
     */
    this.show = function (first_line, second_line, npc_face) {
        show(first_line, second_line, npc_face);
    };

    /**
     * Stops displaying the dialog. Has no effect if no dialog is being displayed.
     */
    this.hide = function () {
        hide();
    };
}

var show = function (first_line, second_line, npc_face) {

};