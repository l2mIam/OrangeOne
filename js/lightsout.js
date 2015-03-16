
$(document).ready(function() {

    // Two dimensional array that represents the playing field
    // A "x" stands for "on"
    // A "o" stands for "off"
    var lightField =
        [
            [ "x", "o", "o", "x", "x" ],
            [ "o", "o", "x", "o", "x" ],
            [ "o", "x", "o", "x", "o" ],
            [ "x", "o", "x", "o", "o" ],
            [ "x", "x", "o", "o", "x" ]
        ];

    // Paint the panel
    repaintPanel();

    // User can click until the game is finished
    var userCanClick = true;

    // Attach a mouse click event listener
    $("#lightpanel").click(function(e) {

        if(!userCanClick) {
            return false;
        }

        // e will give us absolute x, y so we need to calculate relative to canvas position
        var pos = $("#lightpanel").position();
        var ox = e.pageX - pos.left;
        var oy = e.pageY - pos.top;

        // Check which fields we need to flip
        var yField = Math.floor(oy / 100);
        var xField = Math.floor(ox / 100);

        // The field itself
        lightField[yField][xField] = lightField[yField][xField] === "x" ? "o" : "x";

        // The field above
        if(yField-1 >= 0) {
            lightField[yField-1][xField] = lightField[yField-1][xField] == "x" ? "o" : "x";
        }

        // The field underneath
        if(yField+1 < 5) {
            lightField[yField+1][xField] = lightField[yField+1][xField] == "x" ? "o" : "x";
        }

        // The field to the left
        if(xField-1 >= 0) {
            lightField[yField][xField-1] = lightField[yField][xField-1] == "x" ? "o" : "x";
        }

        // The field to the right
        if(xField+1 < 5) {
            lightField[yField][xField+1] = lightField[yField][xField+1] == "x" ? "o" : "x";
        }

        repaintPanel();
    });

    /*
     * Repaints the panel
     */
    function repaintPanel() {

        // Retrieve the canvas
        var canvas = document.getElementById("canvas");

        // Check if the browser supports <canvas>
        if (!canvas.getContext){
            alert("This demo requires a browser that supports the <canvas> element.");
            return;
        } else {
            clear();

            // Get the context to draw on
            var ctx = canvas.getContext("2d");

            // Create the fields
            var allLightsAreOff = true;
            for(var i = 0; i < lightField.length; i++) { // Rows
                for (var j = 0; j < lightField[i].length; j++) { // Columns

                    // Set up the brush
                    ctx.lineWidth = 3;
                    ctx.strokeStyle = "#83BD08";

                    // Start drawing
                    ctx.beginPath();

                    // arc( x, y, radius, startAngle, endAngle, anticlockwise)
                    ctx.arc(j * 100 + 50, i * 100 + 50, 40, 0, Math.PI*2, true);

                    // Actual draw of the border
                    ctx.stroke();

                    // Check if we need to fill the border
                    if(lightField[i][j] == "x") {
                        ctx.fillStyle = "#FFBD38";
                        ctx.beginPath();
                        ctx.arc(j * 100 + 50, i * 100 + 50, 38, 0, Math.PI*2, true);
                        ctx.fill();

                        // Since we need to fill this field, not all the lights are off
                        allLightsAreOff = false;
                    }

                }
            }

            // Check if all the lights are off
            if(allLightsAreOff) {
                // User can't click anymore
                userCanClick = false;

                // Show message
                alert("All lights are off, you finished the game!");
            }
        }
    }

    /*
     * Clears the canvas
     */
    function clear() {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, 500, 500);
    }

});













///**
// * Assignment #2 : Created by Kirsten.
// *
// * Eventually will be merged into the game as a puzzle. Under construction!
// *
// * ==References==
// * Finite Linear Games: An Exploration of the Math Behind the Puzzles by Kirsten Grace & Lisa Smith
// * https://docs.google.com/document/d/1bYxHJp1v97sBxqMzl9X7AzpVWA3LSbGlUoexEK1IyxU/edit?usp=sharing
//
// * Kodyaz HTML5 Tutorials and HTML 5 Examples
// * http://www.kodyaz.com/html5/html5-game-development-lights-out-game-with-javascript.aspx
// *
// */
////
////var puzzletop = document.getElementById("puzzle-top");
////var pzltopctx = puzzletop.getContext("2d");
////
////var puzzlemid = document.getElementById("puzzle");
////var pzlmidctx = puzzlemid.getContext("2d");
//
////var LightsBoard = function () {
////    //var mode = PLAY;
////    //var PLAY = 1, SETUP = 2;
////    //var messageLabel;
////    var ROW = 5;
////    var COLUMN = 5;
////    //var count; //[][] = new int[ROW][COLUMN];
////    //var hint; //[][] = new int[ROW][COLUMN];
////    //var flag = false;
////    //var i0, j0;
////    //var d = 2, r = 15;
////    //var dim;// = Toolkit.getDefaultToolkit().getScreenSize();
////    //var SCALER; // = dim.height/10;
////    var colours; // = { Color.gray, Color.yellow, Color.red };
////    //var listener;
////    //var lightsSolver;
////
////    // context.fillRect(50, 25, 150, 100);
////};
//
///**
// * Returns an Art object given an HTML canvas element.
// */
//function Art(canvas, cellWidth, cellPadding) {
//    this.canvas = canvas;
//    this.ctx = canvas.getContext('2d');
//    this.cellWidth = cellWidth;
//    this.cellPadding = cellPadding;
//}
//
///**
// * Clear the canvas
// */
//Art.prototype.clear = function () {
//    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
//};
//
///**
// * Draws a cell
// */
//Art.prototype.drawCell = function (i, j, state) {
//    this.drawSquare(
//        (this.cellWidth + this.cellPadding) * i + this.cellPadding,
//        (this.cellWidth + this.cellPadding) * j + this.cellPadding,
//        this.cellWidth,
//        this.cellWidth,
//        (state)? '#dd6797' : '#66b5ff');
//};
//
///**
// * Draws a square
// */
//Art.prototype.drawSquare = function (x, y, w, h, color) {
//    this.ctx.fillStyle = color;
//    this.ctx.fillRect(x, y, w, h);
//};
//
//
//function Board(canvas) {
//    this.cells = this._createMatrix(Board.GRID_WIDTH, Board.GRID_HEIGHT);
//
//    this.art = new Art(canvas, Board.CELL_WIDTH, Board.CELL_PADDING);
//    this.canvas = canvas;
//}
//
//Board.CELL_WIDTH = 160;
//Board.CELL_PADDING = 20;
//Board.GRID_WIDTH = 5;
//Board.GRID_HEIGHT = 5;
//
//Board.prototype._createMatrix = function (width, height, opt_val) {
//    var m = [];
//    var i, j, row;
//
//    for (i = 0; i < width; i++) {
//        row = [];
//        for (j = 0; j < height; j++) {
//            row.push(opt_val);
//        }
//        m.push(row);
//    }
//
//    return m;
//}
//
///**
// * Initializes the board.
// */
//Board.prototype.init = function () {
//    this.canvas.onclick = this.handleClickEvent.bind(this);
//    this.show();
//}
//
//Board.prototype.handleClickEvent = function (e) {
//    var rect = this.canvas.getBoundingClientRect();
//    var x = (e.clientX - rect.left) * 2;
//    var y = (e.clientY - rect.top) * 2;
//
//    var cell = this.getCellFromCoordinates(x, y);
//
//    if (cell) {
//        this.triggerCell(cell[0], cell[1]);
//        this.show();
//    }
//}
//
//Board.prototype.triggerCell = function (x, y) {
//    this.toggleCellState(x, y);
//    this.toggleCellState(x, y - 1);
//    this.toggleCellState(x + 1, y);
//    this.toggleCellState(x, y + 1);
//    this.toggleCellState(x - 1, y);
//}
//
//Board.prototype.toggleCellState = function (x, y) {
//    if (x < 0 || x >= Board.GRID_WIDTH) return;
//    if (y < 0 || y >= Board.GRID_HEIGHT) return;
//
//    this.cells[x][y] = !this.cells[x][y];
//}
//
//Board.prototype.getCellFromCoordinates = function (x, y) {
//    var tile = Board.CELL_WIDTH + Board.CELL_PADDING;
//
//    if (x > (Board.CELL_WIDTH + Board.CELL_PADDING) * Board.GRID_WIDTH) return null;
//    if (y > (Board.CELL_WIDTH + Board.CELL_PADDING) * Board.GRID_WIDTH) return null;
//
//    if (x % tile > Board.CELL_PADDING && y % tile > Board.CELL_PADDING) {
//        return [Math.floor(x / tile), Math.floor(y / tile)];
//    } else {
//        return null;
//    }
//}
//
//Board.prototype.show = function () {
//    this.art.clear();
//
//    var i, j;
//    for (i = 0; i < Board.GRID_WIDTH; i++) {
//        for (j = 0; j < Board.GRID_HEIGHT; j++) {
//            this.art.drawCell(i, j, this.cells[i][j]);
//        }
//    }
//};
//
//var canvas = document.getElementById('canvas');
//var b = new Board(canvas);
//b.init();
//

/*
 * Author:      Marco Kuiper (http://www.marcofolio.net/)
 * Color palette: http://www.colourlovers.com/palette/1256638/hate_syringes
 */
