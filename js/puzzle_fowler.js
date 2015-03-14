/**
 * Created by kirst_000 on 3/11/2015.
 */

//var g = window.uwetech.game;

/** Puzzle canvas. */
var puzzletop = document.getElementById("puzzle-top");
var pzltopctx = puzzletop.getContext("2d");

var puzzlemid = document.getElementById("puzzle");
var pzlmidctx = puzzlemid.getContext("2d");

var buggy_code = new Image();
buggy_code.src = './img/puzzlef/bug_tracking.png';
buggy_code.onload = function () { buggy_code.load = true; };

var bug_free = new Image();
bug_free.src = './img/puzzlef/clean_code.png';
bug_free.onload = function () { bug_free.load = true; };

var background_code = new Image();
background_code.src = './img/puzzlef/bg_scaled.png';
background_code.onload = function () { background_code.load = true; };

var intro1 = new Image();
intro1.src = './img/puzzlef/puzzlef_001.png';
intro1.onload = function () { bug_free.load = true; };

var intro2 = new Image();
intro2.src = './img/puzzlef/puzzlef_002.png';
intro2.onload = function () { bug_free.load = true; };

var intro3 = new Image();
intro3.src = './img/puzzlef/puzzlef_003.png';
intro3.onload = function () { bug_free.load = true; };

var win1 = new Image();
win1.src = './img/puzzlef/puzzlef_004.png';
win1.onload = function () { bug_free.load = true; };

//var getMousePos = function(evt) {
//
//    var mouse_rect = puzzletop.getBoundingClientRect();
//    var transX = puzzletop.width / mouse_rect.width;
//    var transY = puzzletop.height / mouse_rect.height;
//
//    return {
//        // client position is in actual pixels on the client
//        // canvas may be stretched.
//        // need to convert coordinates to canvas dimensions
//
//        x: Math.floor((evt.clientX - mouse_rect.left) * transX),
//        y: Math.floor((evt.clientY - mouse_rect.top)  * transY)
//    };
//};
//
//puzzletop.addEventListener('mousedown', function(evt) {
//    //console.log("mouse down!");
//    pf.handleMouseDown(getMousePos(evt));
//});


//$(document).ready(function() {
var puzzle_fowler = function () {

    var xoffset = 165;
    var yoffset = 55;

    var puzzleState = 1;

    // Two dimensional array that represents the playing field
    // A "x" stands for "on"
    // A "o" stands for "off"
    var lightField =
        [
            [ "o", "o", "o", "x", "o" ],
            [ "o", "o", "o", "x", "x" ],
            [ "o", "x", "x", "o", "o" ],
            [ "o", "x", "x", "o", "o" ],
            [ "x", "x", "x", "o", "o" ]
        ];

    function reset() {
        lightField =
            [
                [ "o", "o", "o", "x", "o" ],
                [ "o", "o", "o", "x", "x" ],
                [ "o", "x", "x", "o", "o" ],
                [ "o", "x", "x", "o", "o" ],
                [ "x", "x", "x", "o", "o" ]
            ];
        puzzleState = 1;
    }

    //// Paint the panel
    //renderPuzzle();

    // User can click until the game is finished
    //var userCanClick = true;

    function puzzle_done(win) {
        reset();
        if (win === 1) {
            // win == set flag that says this puzzle was won
            g.puzzleWins[2] = true;
        } else if (win === 0) {
            // failure == set gameover flag (which will call restartGame function)
            g.gameOver = true;
        }
        //console.log("win = " + win);

        // set the puzzle flag to false (get out of the puzzle!)
        // clear both of the puzzle canvases!
        clear();
        g.currentPuzzle = undefined;
        g.isPaused = false;
        //console.log("currentPuzzle = " + g.currentPuzzle);
    }

    // Attach a mouse click event listener
    //$("#lightpanel").click(function(e) {
    this.handleMouseDown = function(mousePos) {

        //console.log("click!");
        //if(!userCanClick) {
        //    return false;
        //}
        var ox = mousePos.x;
        var oy = mousePos.y;
        switch (puzzleState) {
            case 1:
                //this.render();
                puzzleState = 2;
                break;
            case 2:
                //this.render();
                puzzleState = 3;
                break;
            case 3:
                //this.render();
                //check where they clicked

                if (mousePos.x > 375 && mousePos.x < 600 && mousePos.y > 75 && mousePos.y < 165) {
                    // NOPE clicked: cancel puzzle (return to game)
                    puzzle_done(-1);
                } else if (mousePos.x > 167 && mousePos.x < 353 && mousePos.y > 27 && mousePos.y < 97) {
                    // OK clicked
                    //alden_ctx.drawImage(images.puzzle1,0,0);
                    puzzleState = 4;
                    // add other mouse listeners now needed, move to state 5
                    //alden_canvas_top.addEventListener("mousedown", mouseDownListener, false);
                }
                break;
            case 4:
                this.render();
                //// e will give us absolute x, y so we need to calculate relative to canvas position
                //var pos = $("#canvas").position();
                //var ox = e.pageX - pos.left;
                //var oy = e.pageY - pos.top;

                pzlmidctx.strokeRect(482, 245, 123, 102);

                var magicx = Math.floor(puzzlemid.width / 6);
                var magicy = Math.floor(puzzlemid.height / 6);

                // Check which fields we need to flip
                var yField = Math.floor((oy - yoffset) / magicy); //100);
                var xField = Math.floor((ox - xoffset) / magicy); // 100);

                if (yField < 5 && xField < 5) {
                    // The field itself
                    lightField[yField][xField] =
                        lightField[yField][xField] === "x" ? "o" : "x";

                    // The field above
                    if (yField - 1 >= 0) {
                        lightField[yField - 1][xField] =
                            lightField[yField - 1][xField] === "x" ? "o" : "x";
                    }

                    // The field underneath
                    if (yField + 1 < 5) {
                        lightField[yField + 1][xField] =
                            lightField[yField + 1][xField] === "x" ? "o" : "x";
                    }

                    // The field to the left
                    if (xField - 1 >= 0) {
                        lightField[yField][xField - 1] =
                            lightField[yField][xField - 1] === "x" ? "o" : "x";
                    }

                    // The field to the right
                    if (xField + 1 < 5) {
                        lightField[yField][xField + 1] =
                            lightField[yField][xField + 1] === "x" ? "o" : "x";
                    }
                } else if (mousePos.x > 482 && mousePos.x < 605 && mousePos.y > 245 && mousePos.y < 347) {
                    // NOPE clicked: cancel puzzle (return to game)
                    puzzle_done(-1);
                }
                break;
            case 5:
                // WINNER WINNER
                puzzle_done(1);
                break;
            //renderPuzzle(xField, yField);

        }
    };

    this.render = function() {
        switch (puzzleState) {
            case 1:
                pzlmidctx.drawImage(intro1, 0, 0);
                break;
            case 2:
                pzlmidctx.drawImage(intro2, 0, 0);
                break;
            case 3:
                pzlmidctx.drawImage(intro3, 0, 0);
                pzlmidctx.strokeRect(167, 27, 186, 70);
                pzlmidctx.strokeRect(375, 75, 225, 90);

                break;
            case 4:
                renderPuzzle();
                break;
            case 5:
                pzlmidctx.drawImage(win1, 0, 0);
            //case 6:
            //    alden_ctx.drawImage(images.puzzle1_fail, 0, 0);
            //    break;
            //case 7:
            //    alden_ctx.drawImage(images.puzzle1_complete, 0, 0);
            //    break;
            //alden_ctx.clearRect(0, 0, alden_canvas.width, alden_canvas.height);
        }

    };

    this.update = function() {
        // no updates needed, handled by mouse clicks
    };

    /*
     * Repaints the panel
     */
    function renderPuzzle() {

        if (bug_free.load && buggy_code.load && background_code.load) {

            var magicx = (puzzlemid.width - 1) / 6;
            var magicy = (puzzlemid.height - 1) / 6;

            //// Retrieve the canvas
            //var canvas = document.getElementById("canvas");

            clear();

            pzlmidctx.drawImage(background_code, 0, 0,
                background_code.width, background_code.height,
                0, 0, puzzlemid.width, puzzlemid.height);

            //// Get the context to draw on
            //var ctx = canvas.getContext("2d");

            // Create the fields
            var allLightsAreOff = true;
            for (var i = 0; i < lightField.length; i++) { // Rows
                for (var j = 0; j < lightField[i].length; j++) { // Columns


                    // Check if we need to fill the border
                    if (lightField[i][j] === "x") {
                        pzltopctx.drawImage(buggy_code, 0, 0,
                            buggy_code.width, buggy_code.height,
                            (xoffset) + j * magicy, (yoffset) + i * magicy,
                            magicy, magicy);

                        // Since we need to fill this field, not all the lights are off
                        allLightsAreOff = false;
                    }

                    pzlmidctx.strokeStyle = "#000000";

                    // Actual draw of the border
                    //pzlmidctx.stroke();
                    pzlmidctx.strokeRect((xoffset) + j * magicy + 0.5, (yoffset) + i * magicy + 0.5,
                        magicy, magicy);

                }
            }

            pzltopctx.strokeRect(482, 245, 123, 102);

            // debug code TODO
            //pzltopctx.fillStyle = "#000000";
            //pzltopctx.fillRect((xoffset) + xfield * magicy + 25, (yoffset) + yfield * magicy + 25, 10, 10);

            // Check if all the lights are off
            if (allLightsAreOff) {
                //// User can't click anymore
                //userCanClick = false;
                clear();
                puzzleState = 5;
                // Show message
                // alert("All lights are off, you finished the game!");
            }

        }
    }

    /*
     * Clears the canvas
     */
    function clear() {
        //var canvas = document.getElementById("lightpanel");
        //var ctx = canvas.getContext("2d");
        pzltopctx.clearRect(0, 0, puzzletop.width, puzzletop.height);
        pzlmidctx.clearRect(0, 0, puzzlemid.width, puzzlemid.height);
    }

};

var pf = new puzzle_fowler();

/** Make puzzle available to the global namespace. */
window.uwetech.puzzle_fowler = pf;



