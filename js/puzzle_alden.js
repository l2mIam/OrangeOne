/**
* puzzle_alden.js
*
* Puzzle challenge 1 Featuring Alden and Mobus
*
* Author: Loren Milliman
* l2m@uw.edu
* TCSS 491 W15
* Group OrangeOne
* Project UWeTech
* 2015.3.5
*
* Created by kirst_000 on 3/5/2015.
*/

// ISSUES TO RESOLVE:
//
// UNDER GAME STATUS (at the bottom)
//   Implement Reset
//   handle "unloading"/exiting puzzle
//   Doesn't know about g.puzzleWins[0] yet so error on success
//
// TO DO:
//   Update puzzle_code on "mouseUp"/placing block



// game loop test
// game loop calls update()
// game look calls render()


window.requestAnimFrame = (function () {
  return window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (/* function */ callback, /* DOMElement */ element) {
    window.setTimeout(callback, 1000 / 60);
  };
})();

/** Puzzle canvas. */
var alden_canvas = document.getElementById('puzzle');
alden_ctx = alden_canvas.getContext('2d');

var alden_canvas_top = document.getElementById('puzzle-top');
var alden_ctx_top = alden_canvas_top.getContext('2d');

// your main puzzle object!
var puzzle_alden;

var puzzle_alden_game = function() {

  this.start = function () {
    this.loop();
  }

  this.loop = function () {
    puzzle_alden.update();
    puzzle_alden.render();
    requestAnimFrame(this.loop.bind(this));
  };
}

var g = new puzzle_alden_game();

//////////////////////////////////////////////////////////////////////////
// PRE-LOAD ALL PUZZLE ASSETS
// Display image 1 when done loading
// set alden_state = 1
//////////////////////////////////////////////////////////////////////////
var images = {};
function loadImages(sources, callback) {
  var loadedImages = 0;
  var numImages = 0;
  // get num of sources
  for(var src in sources) {
    numImages++;
  }
  for(var src in sources) {
    images[src] = new Image();
    images[src].onload = function() {
      if(++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = sources[src];
  }
}

var sources = {
  puzzle1_img1:     "./img/puzzle1/puzzle1_img1.jpg",
  puzzle1_img2:     "./img/puzzle1/puzzle1_img2.jpg",
  puzzle1_img3:     "./img/puzzle1/puzzle1_img3.jpg",
  puzzle1:          "./img/puzzle1/puzzle1.jpg",
  puzzle1_complete: "./img/puzzle1/puzzle1_complete.jpg",
  puzzle1_fail:     "./img/puzzle1/puzzle1_fail.jpg",
  numbers:          "./img/puzzle1/numbers.jpg"
};

loadImages(sources, function(images) {
  // images loaded set initial state
  init();
});


//////////////////////////////////////////////////////////////////////////
// INITIALIZE PUZZLE
//////////////////////////////////////////////////////////////////////////
function init() {
  alden_state = 1;
  puzzle_correct = 0;
  alden_ctx.drawImage(images.puzzle1_img1,0,0);
  lastX = lastY = 0;
}

//////////////////////////////////////////////////////////////////////////
// TRACK STATE OF GAME
//////////////////////////////////////////////////////////////////////////

// Track state of puzzle
var alden_state;

// Puzzle_code array tracks block input
// value in each position represents 0) incorrect, 1) correct
var puzzle_code = [0,0,0,0,0,0,0];


//////////////////////////////////////////////////////////////////////////
// MOUSE ACTIONS
//////////////////////////////////////////////////////////////////////////
var dragObject;
var dragging;
var mouseX;
var mouseY;
var lastX;
var lastY;
var dragHoldX;
var dragHoldY;
var rect = alden_canvas_top.getBoundingClientRect();
var transX = alden_canvas_top.width /rect.width;
var transY = alden_canvas_top.height / rect.height

function getMousePos(alden_canvas_top, evt) {
  return {
    // client position is in actual pixels on the client
    // canvas may be stretched.
    // need to convert coordinates to canvas dimensions
    x: Math.floor((evt.clientX - rect.left) * transX),
    y: Math.floor((evt.clientY - rect.top)  * transY)
  };
}

alden_canvas_top.addEventListener('mousedown', function(evt) {
  var mousePos = getMousePos(alden_canvas_top, evt);
  // var message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
  switch(alden_state) {
    case 1:
//////////////////////////////////////////////////////////////////////////
// PRE PUZZLE IMAGES
//////////////////////////////////////////////////////////////////////////

      // load second image
      alden_ctx.drawImage(images.puzzle1_img2,0,0);
      alden_state = 2;
      break
    case 2:
      // load third image
      alden_ctx.drawImage(images.puzzle1_img3,0,0);
      alden_state = 3;
      break
    case 3:
      if (mousePos.x > 300 && mousePos.x < 560 && mousePos.y > 30 && mousePos.y < 80) {
        // NOPE clicked: cancel puzzle (return to game)
        puzzle_done(-1);
      } else if (mousePos.x > 400 && mousePos.x < 530 && mousePos.y > 150 && mousePos.y < 215) {
        // OK clicked
        alden_ctx.drawImage(images.puzzle1,0,0);
        alden_state = 5;
        // add other mouse listeners now needed, move to state 5
        alden_canvas_top.addEventListener("mousedown", mouseDownListener, false);

      }
      break
    case 5:
      // PUZZLE PLAY STATE
      OK:
      if (mousePos.x > 460 && mousePos.y > 270) {
        // OK pressed check if code is correct
        check_code:
        for (var i in puzzle_code) {
          if(puzzle_code[i] === 0) {
            // incorrect code
            alden_ctx.drawImage(images.puzzle1_fail,0,0);
            alden_state = 6;
            break OK;
          }
        }
        // correct code...WINNER
        alden_ctx.drawImage(images.puzzle1_complete,0,0);
        alden_state = 7;
      }
      break
    case 6:
      // FAIL STATE wait for user acknowledgement
      puzzle_done(0);
      break
    case 7:
      // WINNER!  WINNING! wait for acknowldgement
      puzzle_done(1); // win
      break
    }
}, false);

//////////////////////////////////////////////////////////////////////////
// MOVE PUZZLE BLOCKS
//////////////////////////////////////////////////////////////////////////

// GetSelectedObject returns the block num of the selected block
// OUTPUT: Selected block number
function getSelectedObject() {
  var retVal = -1;
  if (mouseX > 16 && mouseX < 592 && mouseY > 16 && mouseY < 70) {
    // a block was selected
    retVal = Math.ceil( (mouseX - 16) / 64 );
    // Set hold position (where are on the block did I click)
    dragHoldX = Math.floor( (mouseX - 16) % 64 );
    dragHoldY = mouseY - 16;

    // going to handle this in code check, by looking for '8675349'
    // if (retVal === 4) {
    //   retVal = 0; // block 0 in position 4 (4 is not needed in code)
    // }
  }
  return {
    obj: retVal
  };
}

// getDropLocation
// Determine if the block is being dropped in a 'bucket'
// RETURN: -1 (not valid), index of 'bucket' (from left to right: 0 through 6)
function getDropLocation() {
  var retVal = -1;
  var ctrX = lastX + 32;
  var ctrY = lastY + 32;
  if (ctrY > 96 && ctrY < 192 && ctrX > 16 && ctrX < 592) {
    // Over the basket, get the index and return it
    retVal = Math.floor( (ctrX - 24) / 80 );
  }
  return retVal;
}

function mouseDownListener(evt) {
  if(alden_state === 5) {
    // Puzzle play state
    mouseX = Math.floor((evt.clientX - rect.left) * transX),
    mouseY = Math.floor((evt.clientY - rect.top)  * transY)
    var i;

    // find which object was selected
    dragObject = getSelectedObject();
    if (dragObject.obj >= 0) {
      dragging = true;
    }

    if (dragging) {
      // console.log("dragging");

      window.addEventListener("mousemove", mouseMoveListener, false);
    }
    alden_canvas_top.removeEventListener("mousedown", mouseDownListener, false);
    window.addEventListener("mouseup", mouseUpListener, false);
    // console.log("mouseUpAdded");

    //code below prevents the mouse down from having an effect on the main browser window:
    if (evt.preventDefault) {
      evt.preventDefault();
    } //standard
    else if (evt.returnValue) {
      evt.returnValue = false;
    } //older IE
    return false;
  }
}

function mouseUpListener(evt) {
  // console.log("mouseUp");

  alden_canvas_top.addEventListener("mousedown", mouseDownListener, false);
  window.removeEventListener("mouseup", mouseUpListener, false);
  if (dragging) {
    // Clear last drawn block
    alden_ctx_top.clearRect(lastX, lastY, 64, 64);

    var drop_index = getDropLocation();
    if (drop_index < 0) {
    } else {
      // Mouse up, place block on lower canvas (overwrite previously placed block)
      alden_ctx.drawImage(images.numbers, 0 + ( (dragObject.obj - 1) *64), 0, 64, 64, 32 + (drop_index * 80), 112, 64, 64);
    }
    // Mouse up, place block (overwrite previously placed block)
    console.log(drop_index );
    // set puzzle_code[i] = 0) incorrect, 1) correct
    dragging = false;
    window.removeEventListener("mousemove", mouseMoveListener, false);
  }
}

function mouseMoveListener(evt) {
  // console.log("mouseMove");

  // mouseX = Math.floor((evt.clientX - rect.left) * transX),
  // mouseY = Math.floor((evt.clientY - rect.top)  * transY)

  // Clear last drawn block before drawing next
  alden_ctx_top.clearRect(lastX, lastY, 64, 64);
  // translate x,y from screen res to canvas to upper left corner of block
  lastX = Math.floor((evt.clientX - rect.left) * transX) - dragHoldX;
  lastY = Math.floor((evt.clientY - rect.top)  * transY) - dragHoldY;
  // lastX = mouseX - dragHoldX;
  // lastY = mouseY - dragHoldY;
  // Draw selected block on mouseDrag
  alden_ctx_top.drawImage(images.numbers, 0 + ( (dragObject.obj - 1) *64), 0, 64, 64, lastX, lastY, 64, 64);

}

//////////////////////////////////////////////////////////////////////////
// GAME STATUS
// Set win/loose flags and handle reset
//////////////////////////////////////////////////////////////////////////

// Puzzle_done is called to exit the puzzle
// INPUT: win
// Values: -1) cancel, 0) failed, 1) winner!
var puzzle_done = function(win) {
  if (win === 1) {
    // win == set flag that says this puzzle was won
    g.puzzleWins[0] = true;
  } else if (win === 0){
    // failure == set gameover flag (which will call restartGame function)
    g.gameOver = true;
  }
  console.log("win = " + win);

  // set the puzzle flag to false (get out of the puzzle!)
  g.currentPuzzle = undefined;
}

// puzzle_alden.reset() {
//   g.puzzleWins[0] = false;
//   g.gameOver = false;
// }
