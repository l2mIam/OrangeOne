// Relate animation drawing to window frame rate
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame  ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

/** NOT for animations/movement! This is strictly for single key press logic. */
window.addEventListener('keydown', function (e) {
    if (g.currentPuzzle === undefined) {
        //console.log("no puzzle");
        g.handleKeyDownEvent(e.keyCode);
    } else {
        //console.log("yes puzzle");
        // TODO: do puzzles want to hear key events??
        //g.currentPuzzle.handleKeyDownEvent(e.keyCode);
    }
});

window.addEventListener('keyup', function (e) {
    if (g.currentPuzzle === undefined) {
        g.handleKeyUpEvent(e.keyCode);
    } else {
        // TODO: do puzzles want to hear key events??
        //g.currentPuzzle.handleKeyUpEvent(e.keyCode);
    }
});

/** Array containing all currently pressed keys. This is for animations/movement. */
var keys = window.uwetech.Input.keys; // code is in input.js

var BOX_WIDTH = 29; // width of the player bounding box for collisions
var BOX_HEIGHT = 24; // height of the player bounding box for collisions

//  constants!     W 87, S 83, A 65, D 68, space 32
var W_KEY = 87;
var S_KEY = 83;
var A_KEY = 65;
var D_KEY = 68;
var O_KEY = 79;
var P_KEY = 80;
var LEFT_KEY  = 37;
var UP_KEY    = 38;
var RIGHT_KEY = 39;
var DOWN_KEY  = 40;
var ENTER_KEY = 13;
var SPACE_KEY = 32;
var DEBUG_KEY = 192;  // ` key ~ key  is the debug key
var ESC_KEY = 27;

/** Bottom canvas is for the background. NO ANIMATIONS. */
var btmcanvas = document.getElementById('bottomlayer'),
    btmctx = btmcanvas.getContext('2d');

/** Middle canvas is for drawing sprites & other animated stuff. */
var midcanvas = document.getElementById('middlelayer'),
    midctx = midcanvas.getContext('2d');

/** Top canvas will draw on top of bottom and middle canvas. */
var topcanvas = document.getElementById('toplayer'),
    topctx = topcanvas.getContext('2d');

/** Loading screen canvas, or something. */
var loadcanvas = document.getElementById('loadlayer'),
    loadctx = loadcanvas.getContext('2d');

/** Loading screen canvas, or something. */
var timercanvas = document.getElementById('timerlayer'),
    timerctx = timercanvas.getContext('2d');

/** BTW: Other canvases exist you don't know about are in the HTML file. */

/** Represents the 2D array for the zone's boundaries.
 *  0 == walkable space
 *  1 == non walkable space
 *  2 == exit exists here
 *  ___ == ????
 */
var sign_screen_bounds = null;

// Keeps the player in bounds -- Kirsten update: no longer being used.
var math = function() {
  this.clamp = function(i, min, max) {
    return Math.max(Math.min(i, max),min);
  };
};
// TODO: What is this for?
function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

//http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
function is_collide(a, b) {

  var ax_1 = a.x - 15;
  var ax_2 = a.x + BOX_WIDTH + 45; // + 32 is player width but 31 is smoother
  var ay_1 = a.y + 10;
  var ay_2 = a.y + BOX_HEIGHT + 70; // + 32 is height of player's box (ignores head collisions)

  var bx_1 = b.x;
  var bx_2 = b.x + BOX_WIDTH; // + 32 is player width but 31 is smoother
  var by_1 = b.y;
  var by_2 = b.y + BOX_HEIGHT;

  return (ax_1 < bx_2 && ax_2 > bx_1 && ay_1 < by_2 && ay_2 > by_1);
}

/**
 *  The camera will control what part of a map we're viewing and where
 *  the entities will be drawn on screen relative to current camera view
 * @constructor
 */
var Camera = function () {
    /**
     * Recalculate camera position based entirely on the passed
     * entity's x and y location. (entity should be player!!)
     *
     * Requires background.image.width/height and midcanvas.width/height
     * to determine edges of map and center the player correctly.
     * @param entity Should be player.
     */
    this.setup = function(entity) {
          //this.x = (canvas.width / 2) - entity.x;
          //this.y = (canvas.height / 2) - entity.y;

          // these variables determine where the camera starts
          this.x = (midcanvas.width / 2) - entity.x;
          this.y = (midcanvas.height / 2) - entity.y;

          // these if elseif blocks prevent the camera from moving
          // off the edge of the map

          // if the right side of the camera would go off the side...
          if (entity.x + (midcanvas.width / 2) > background.image.width) {
            // set it to the rightmost legal position
            this.x = midcanvas.width - background.image.width;
          } // if the left side would go off...
          else if(entity.x - (midcanvas.width / 2) < 0) {
            // set it to the leftmost legal position
            this.x = 0;
          }
          // if the top of the camera would scroll off
          if (entity.y - (midcanvas.height / 2) < 0 ) {
              // set it to the bottommost legal position
              this.y = 0;
            } // if the bottom of the camera would scroll off
            else if((midcanvas.height / 2) + entity.y > background.image.height) {
              // set it to the topmost legal position
              this.y = midcanvas.height - background.image.height;
            }
    };

    /**
     * Currently redirects to setup(), as the calculation is the same.
     * @param entity Should be the player.
     */
      this.getPosition = function (entity) {
          this.setup(entity);
      };
      //    function(entity) {
      //  this.x = (canvas.width / 2) - entity.x;
      //  this.y = (canvas.height / 2) - entity.y;
      //};
};

/**
 * Creates a new sprite. What is a sprite? A sprite is an object that has a visual
 * representation (spritesheet image), has a location in the world (x, y). Some
 * sprites may have additional functionality (ex: player sprites have speed).
 * @constructor
 */
var Sprite = function() {
    this.load = false;
    this.imgX = 0; // TODO: What is imgX for?

    /**
     * Lots of parameter options! Yay! Seriously though, most of these parameters are
     * needed to draw the image for this sprite correctly.
     */
    this.setOptions = function(src, srcX, srcY, dtx, dty, x, y, width, height, speed) {
            this.srcX = srcX;
            this.srcY = srcY;
            this.dtx = dtx;
            this.dty = dty;
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.speed = speed;
           // this.facing = "south";
            this.dialog = [];
            this.talkTo = false;
            this.faceSpot = 0;// Used to check if you want the dialog on left or right
                                // O is left 1 is right
            this.faceArray = []; // Used to check which face you want to show
            this.face = new Image();
            this.visualRadius = 50;
            this.puzzleName = ""; // TODO: What is this?
                                    // ^^ If I remember correctly this was for Duncan's
                                    // bounding box, so if the npc is within 50 of you
                                    // he will stop.

            this.x_hook = 0;
            this.y_hook = 0;

            this.elapsedTime = 0; // TODO: This tracks how fast it should animate - Dylan.
            this.image = new Image();
            this.image.src = src;
            //console.log(" " + src + "=" + this.image.height); // announce resource height

        /**
         * Renders this sprite (using the correct animation step previously "rolled").
         */
        this.render = function() {
            midctx.drawImage(this.image, this.srcX, this.srcY, this.dtx, this.dty,
                this.x - this.x_hook, this.y - this.y_hook, this.width, this.height);

        };
    };

    this.check_units = function() {
      var getEntityArray = g.entiteZones[g.currentZone.id]
      if (getEntityArray !== undefined) {
        var entitiesCount = getEntityArray.length;
      }
      for (var i = 0; i < entitiesCount; i++) {
          var entity = getEntityArray[i];
          if(entity.load) {
            entity.render();
            if(is_collide(entity, player)) {
              interactNPC = entity;
              return false;
            }
          }
      }
      return true;
    };

    this.movePlayer = function(clockTick) {

        /** Collision detection needs to consider the whole square the character occupies. */
        var x_leftmost = Math.floor(player.x/32);
        var x_rightmost = Math.floor((player.x + BOX_WIDTH) / 32); // + 32 is player width but 31 is smoother
        var y_upmost = Math.floor(player.y/32);
        var y_downmost = Math.floor((player.y + BOX_HEIGHT) / 32); // + 32 is height of player's box (ignores head collisions)

        var y_new_grid = 0; // tracks if moving player will cause them to enter new grid
        var x_new_grid = 0; // tracks if moving player will cause them to enter new grid

        var exit; // tracks if the player's movement has triggered an exit and zone change

        /** Checks which keys are being currently pressed and moves player if new location is valid. */
        if(W_KEY in keys || UP_KEY in keys) {
          // W
            this.spriteRoll(512, 8, clockTick, 0.1); // even if player doesn't move, animate them!

            /** Determine if moving the player will result in entering a new grid location. */
            y_new_grid = 0;
            // if player would enter new grid and that grid isn't offscreen
            if (Math.floor((player.y - this.speed) / 32) !== y_upmost &&
                           (y_upmost - 1 >= 0)) {
                y_new_grid =  1;
            }

            if ((player.y - (this.speed)) > 0) {
                /** Check that the player can move based on left AND right bounding box */
                if (sign_screen_bounds[y_upmost - y_new_grid][x_leftmost] === 0 &&
                    sign_screen_bounds[y_upmost - y_new_grid][x_rightmost] === 0) {
                    this.y -= this.speed;
                }


            } else { /** player is trying to move off screen, align them to edge if valid location. */
                if (sign_screen_bounds[0][x_leftmost] === 0 &&
                    sign_screen_bounds[0][x_rightmost] === 0) {
                    this.y = 1;
                }
            }

            /** Check for exits to the north. */
            if (sign_screen_bounds[y_upmost - y_new_grid][x_leftmost] === 2) {
               // console.log("EXIT FOUND");
                exit = g.currentZone.exits[x_leftmost + "," + (y_upmost - y_new_grid)];
            } else if (sign_screen_bounds[y_upmost - y_new_grid][x_rightmost] === 2) {
                exit = g.currentZone.exits[x_rightmost + "," + (y_upmost - y_new_grid)];
            }
        }

        if(S_KEY in keys || DOWN_KEY in keys) { // S
            this.spriteRoll(640, 8, clockTick, 0.1); // even if player doesn't move, animate them!

            /** Determine if moving the player will result in entering a new grid location*/
            y_new_grid = 0;
            // if player would enter new grid and that grid isn't offscreen
            if (Math.floor((player.y + BOX_HEIGHT + this.speed) / 32) !== y_downmost &&
                          ((y_downmost + 1) <= (sign_screen_bounds.length - 1))) {
                y_new_grid = 1;
            }

            /** If player would move off screen, move to edge instead, IF edge is a valid location */
            if ((player.y + BOX_HEIGHT + this.speed) < (background.image.height - 1)) { // "+32" player height no head
                /** Check that the player can move based on left AND right bounding box */
                if (sign_screen_bounds[y_downmost + y_new_grid][x_leftmost] === 0 &&
                    sign_screen_bounds[y_downmost + y_new_grid][x_rightmost] === 0) {
                    this.y += this.speed;
                }
            } else { /** player is trying to move off screen, align them to edge if valid location. */
                if (sign_screen_bounds[sign_screen_bounds.length - 1][x_leftmost] === 0 &&
                    sign_screen_bounds[sign_screen_bounds.length - 1][x_rightmost] === 0) {
                    this.y = (background.image.height - 1) - BOX_HEIGHT; // "-32" is height of player minus head
                }
            }

            /** Check for exits to the south. */
            if (sign_screen_bounds[y_downmost + y_new_grid][x_leftmost] === 2) {
                exit = g.currentZone.exits[x_leftmost + "," + (y_downmost + y_new_grid)];
            } else if (sign_screen_bounds[y_downmost + y_new_grid][x_rightmost] === 2) {
                exit = g.currentZone.exits[x_rightmost + "," + (y_downmost + y_new_grid)];
            }
        }

        if(A_KEY in keys || LEFT_KEY in keys) { // A
            this.spriteRoll(576, 8, clockTick, 0.1); // even if player doesn't move, animate them!

            /** Determine if moving the player will result in entering a new grid location*/
            x_new_grid = 0;
            // if player would enter new grid and that grid isn't offscreen
            if (Math.floor((player.x - this.speed) / 32) !== x_leftmost &&
                           (x_leftmost - 1 >= 0)) {
                x_new_grid = 1;
            }

            /** If player would move off screen, move to edge instead, IF edge is a valid location */
            if ((player.x - this.speed) > 0) {
                /** Check that the player can move based on top AND bottom bounding box */
                if (sign_screen_bounds[y_upmost][x_leftmost - x_new_grid] === 0 &&
                    sign_screen_bounds[y_downmost][x_leftmost - x_new_grid] === 0) {
                    this.x -= this.speed;
                }
            } else { /** player is trying to move off screen, align them to edge if valid location. */
                if (sign_screen_bounds[y_upmost][0] === 0 &&
                    sign_screen_bounds[y_downmost][0]) {
                    this.x = 0;
                }
            }

            /** Check for exits to the west. */
            if (sign_screen_bounds[y_upmost][x_leftmost - x_new_grid] === 2) {
                exit = g.currentZone.exits[(x_leftmost - x_new_grid) + "," + y_upmost];
            } else if (sign_screen_bounds[y_downmost][x_leftmost - x_new_grid] === 2) {
                exit = g.currentZone.exits[(x_leftmost - x_new_grid) + "," + y_downmost];
            }
        }

        if(D_KEY in keys || RIGHT_KEY in keys) { // D
            this.spriteRoll(704, 8, clockTick, 0.1); // even if player doesn't move, animate them!

            /** Determine if moving the player will result in entering a new grid location*/
            x_new_grid = 0;
            // if player would enter new grid and that grid isn't offscreen
            if (Math.floor((player.x + BOX_WIDTH + this.speed) / 32) !== x_rightmost &&
                          ((x_rightmost + 1) <= sign_screen_bounds[y_upmost].length - 1)) {
                x_new_grid = 1;
            }

            /** If player would move off screen, move to edge instead, IF edge is a valid location */
            if ((player.x + BOX_WIDTH + this.speed) < (background.image.width - 1)) { // "+32" is width of player
                /** Check that the player can move based on top AND bottom bounding box */
                if (sign_screen_bounds[y_upmost][x_rightmost + x_new_grid] === 0 &&
                    sign_screen_bounds[y_downmost][x_rightmost + x_new_grid] === 0) {
                    this.x += this.speed;
                }
            } else { /** player is trying to move off screen, align them to edge if valid location. */
                if (sign_screen_bounds[y_upmost][sign_screen_bounds[y_upmost].length - 1] === 0 &&
                    sign_screen_bounds[y_downmost][sign_screen_bounds[y_upmost].length - 1] === 0) {
                    this.x = (background.image.width - 1) - BOX_WIDTH; // "-32" is width of player
                }
            }

            /** Check for exits to the south. */
            if (sign_screen_bounds[y_upmost][x_rightmost + x_new_grid] === 2) {
                exit = g.currentZone.exits[(x_rightmost + x_new_grid) + "," + y_upmost];
            } else if (sign_screen_bounds[y_downmost][x_rightmost + x_new_grid] === 2) {
                exit = g.currentZone.exits[(x_rightmost + x_new_grid) + "," + y_downmost];
            }
        }

        /** Kirsten debug code */
        //if (Math.floor(oldx/32) !== Math.floor(this.x/32) ||
        //    Math.floor(oldy/32) !== Math.floor(this.y/32)) {
        //    console.log("(" + player.x + "," + player.y + ") [" +
        //    /**Math.floor*/(player.x / 32)  + " , " + /** Math.floor*/(player.y / 32) + "]");
        //}

        if (exit !== undefined) { // if an exit was found...
            g.loadZone(exit.go_to_zone, exit.x_entrance, exit.y_entrance);
        }

    };

    /**
     * This code is triggered when the interact button/key was pressed.
     */
    this.interact = function(interactNPC) {
      if(interactNPC !== undefined &&
          interactNPC.puzzleName === "Alden" &&
          g.puzzleWins[0] === false) {
        g.currentPuzzle = uwetech.puzzle_alden;
      }
      if(interactNPC !== undefined &&
          interactNPC.puzzleName === "Fowler" &&
          g.puzzleWins[2] === false) {
        g.currentPuzzle = uwetech.puzzle_fowler;
      }
      if(interactNPC !== undefined &&
          interactNPC.puzzleName === "Ross" &&
          g.puzzleWins[2] === true &&
          g.puzzleWins[0] === true) {
            window.open("http://l2miam.github.io/OrangeOne/menu-finish");
      }

        if(interactNPC === undefined) {

        /** Kirsten testing queued actions for multiple text pop-ups.*/
          if (npc_Alden.talking === undefined) {
              npc_Alden.talking = true;   // test code forces Alden to start talking.
          }
          if (npc_Alden.talking === true) { // queues up some dialog since Alden is talking.
            //console.log(npc_Alden.face); // kirsten test code
            //    g.queuedActions.push(function (){window.uwetech.dialog.show(
            //      "You hear students in the distance having fun without you.", npc_Alden.face);});
            //// kirsten test code
            //
            //  g.queuedActions.push(function (){window.uwetech.dialog.showRight(
            //      "Maybe you should go talk to them.", npc_Alden.face);});
              g.queuedActions.push(function (){window.uwetech.dialog.showInner(
                  "You hear students in the distance having fun without you.");});
              // kirsten test code

              g.queuedActions.push(function (){window.uwetech.dialog.showInner(
                  "Maybe you should go talk to them.");});
            // Of course, always make sure you call a dialog.hide() when you are done showing text!!
              g.queuedActions.push(function () {window.uwetech.dialog.hide();});
            //console.log(g.queuedActions[0]);
              npc_Alden.talking = false;
          } else if (npc_Alden.talking === false) {
            // test code to start alden talking again if the queue will be empty after this cycle.
              if (g.queuedActions.length <= 1) {
                  npc_Alden.talking = true; // make him talk on next spacebar press
              }
          }
      } else {
        if (npc_Alden.talking === undefined) {
            npc_Alden.talking = true;   // test code forces Alden to start talking.
        }
        if (npc_Alden.talking === true) {
          var dialogSize = interactNPC.dialog.length;
          for(var i = 0; i < dialogSize; i++) {

            var text = interactNPC.dialog[i];
            var face = interactNPC.faceArray[i];
            var faceSpot = interactNPC.faceSpot;

            if(faceSpot === 0 ){
              g.queuedActions.push((function (text, face) {
                     return function () {
                         window.uwetech.dialog.showRight(text, face);
                     };
                  })(text, face));
            }
            if(faceSpot === 1) {
              g.queuedActions.push((function (text, face) {
                     return function () {
                         window.uwetech.dialog.show(text, face);
                     };
                  })(text, face));
            }

            console.log(text);
          }
          interactNPC.talkTo ^= true;
          g.queuedActions.push(function () {window.uwetech.dialog.hide();});
          npc_Alden.talking = false;
        } else if (npc_Alden.talking === false) {
          // test code to start alden talking again if the queue will be empty after this cycle.
            if (g.queuedActions.length <= 1) {
                npc_Alden.talking = true; // make him talk on next spacebar press
            }
        }
      }

        this.checkQueue();
        ///** This logic will check if any actions are currently queued and pause the game.
        // * Then the action at the front of the queue is called. If the action just called
        // * results in the queue now being empty, the game is also un-paused. */
        //if (g.queuedActions.length > 0 && g.queuedActions !== undefined) {
        //    g.isPaused = true;
        //    g.timer.isPaused = true;
        //    g.queuedActions.shift()();
        //
        //    if (g.queuedActions.length === 0) {
        //        g.isPaused = false;
        //        g.timer.isPaused = false;
        //    }
        //}


    };

    this.checkQueue = function() {
        /** This logic will check if any actions are currently queued and pause the game.
         * Then the action at the front of the queue is called. If the action just called
         * results in the queue now being empty, the game is also un-paused. */
        if (g.queuedActions.length > 0 && g.queuedActions !== undefined) {
            g.isPaused = true;
            g.timer.isPaused = true;
            g.queuedActions.shift()();

            if (g.queuedActions.length === 0) {
                g.isPaused = false;
                g.timer.isPaused = false;
            }
        }
    }

    /**
     * TODO: Add comments about what spriteRoll is.
     * @param srY
     * @param maxLength
     * @param tick
     * @param frameDuration
     */
    this.spriteRoll = function(srY, maxLength, tick, frameDuration) {
        this.elapsedTime += tick;
        this.frameDuration = frameDuration;
        this.totalTime = frameDuration*maxLength;

        if ((this.elapsedTime >= this.totalTime)) {
          this.elapsedTime = 0;
        }

        this.srcY = srY;
        this.imgX += 1;



        this.srcX = this.dtx * Math.floor(this.elapsedTime / this.frameDuration);

        if (this.imgX >= maxLength) {
            this.imgX = 0;
        }
    };

    this.currentFrame = function () {
        return Math.floor(this.elapsedTime / this.frameDuration);
    };

    this.update = function() {

    };
};


/**
 * Kirsten's added this code for Background Object. This is really just to
 * render the background of a zone. I just didn't want it as part of the
 * Sprite code because it is so simple and doesn't really "do" stuff.
 */
var BackgroundObject = function() {
    this.load = false;

    this.srcX = 0;
    this.srcY = 0;
    this.dtx = btmcanvas.width;
    this.dty = btmcanvas.height;
    this.x = 0;
    this.y = 0;
    this.width = btmcanvas.width;
    this.height = btmcanvas.height;

    /**
     * Sets the current background to the passed Image object.
     * @param image_object
     */
    this.set = function(image_object) {
        this.image = image_object;

        this.renderBackground = function(xoffset, yoffset) {
            btmctx.drawImage(this.image, this.srcX + xoffset, this.srcY + yoffset,
                this.dtx, this.dty,
                this.x, this.y, this.width, this.height);
        };

        this.debugOn = function (xoffset, yoffset) {
            //btmctx.clearRect(0, 0, topcanvas.width, topcanvas.height);
            btmctx.font = "bold 16px sans-serif";
            btmctx.fillStyle = "#ff00ee";

            for (var y = Math.floor(yoffset / 32); y < sign_screen_bounds.length; y += 1) {
                for (var x = Math.floor(xoffset / 32); x < sign_screen_bounds[0].length; x += 1) {
                    var value = sign_screen_bounds[y][x];
                    btmctx.fillText(value,x * 32 - xoffset + 10,
                        32 + y * 32 - yoffset - 10);
                }
            }
        };
    };
};

var player = new Sprite();
var npc_Chin = new Sprite();
var npc_Alden = new Sprite();

var npc_Map1StairWalker = new Sprite();
var npc_Map1BottomWalker = new Sprite();
var npc_Map1dummyOne = new Sprite();
var npc_Map1dummyTwo = new Sprite();
var npc_Map1dummyThree = new Sprite();
var npc_Map1Blocker = new Sprite();

var npc_Map2Cashier = new Sprite();
var npc_Map2Bookman = new Sprite();

var npc_Map3BottomWalker = new Sprite();
var npc_Map3dummyOne = new Sprite();
var npc_Map3dummyTwo = new Sprite();
var npc_Map3dummyThree = new Sprite();
var npc_Map3dummyFour = new Sprite();
var npc_Map3dummyFive = new Sprite();
var npc_Map3dummySix = new Sprite();
var npc_Map3Jay = new Sprite();
var npc_Map3SilentBob = new Sprite();

var npc_Map4theChin = new Sprite();
var npc_Map4frontStudentOne = new Sprite();
var npc_Map4frontStudentTwo = new Sprite();
var npc_Map4middleStudentOne = new Sprite();
var npc_Map4middleStudentTwo = new Sprite();
var npc_Map4backStudentOne = new Sprite();

var npc_Map5dummyOne = new Sprite();
var npc_Map5theFowler = new Sprite();

var npc_Map6lib = new Sprite();

var npc_Map7dummyOne = new Sprite();
var npc_Map7dummyTwo = new Sprite();
var npc_Map7dummyThree = new Sprite();
var npc_Map7dummyFour = new Sprite();

var npc_Map8dummyOne = new Sprite();
var npc_Map8dummyTwo = new Sprite();
var npc_Map8dummyThree = new Sprite();
var npc_Map8dummyFour = new Sprite();

var npc_Map10dummyOne = new Sprite();
var npc_Map10dummyTwo = new Sprite();
var npc_Map10dummyThree = new Sprite();
var npc_Map10dummyFour = new Sprite();
var npc_Map10theAlden = new Sprite();
//var background = new Sprite();

// var alden_por = new Dialog();


// src, srcX, srcY, dtx, dty, x, y, width, height, speed

// NPC's
player.setOptions("./img/purple_orc.png", 0, 640, 64, 64,
                                    0, 0, 64, 64, 3);
//npc_Mobus.setOptions("./img/mobus.png", 0, 640, 64, 64, 350, 10, 62, 62, 1);

npc_Map1StairWalker.setOptions("./img/NPC/guyOne.png", 0, 140, 64, 64, 350,10, 62, 62, 1);
npc_Map1BottomWalker.setOptions("./img/NPC/spriteRobert.png", 0, 140, 64, 64, 300, 1020, 62, 62, 2);
npc_Map1Blocker.setOptions("./img/NPC/girlOne.png", 0, 140, 64, 64, 530, 141, 62, 62, 2);
npc_Map1dummyOne.setOptions("./img/NPC/girlOne.png", 0, 140, 64, 64, 100, 500, 62, 62, 2);
npc_Map1dummyTwo.setOptions("./img/NPC/monk.png", 0, 140, 64, 64, 150, 900, 62, 62, 2);
npc_Map1dummyThree.setOptions("./img/NPC/Skeleton.png", 0, 140, 64, 64, 150, 150, 62, 62, 2);


npc_Map2Cashier.setOptions("./img/NPC/guyTwo.png", 0, 140, 64, 64, -15,155, 62, 62, 0);
npc_Map2Bookman.setOptions("./img/NPC/girlTwo.png", 0, 140, 64, 64, 430, 40, 62, 62, 0);

npc_Map3BottomWalker.setOptions("./img/NPC/monk.png", 0, 140, 64, 64, 900, 600, 62, 62, 2);
npc_Map3dummyOne.setOptions("./img/NPC/girlOne.png", 0, 140, 64, 64, 800, 150, 62, 62, 2);
npc_Map3dummyTwo.setOptions("./img/NPC/girlTwo.png", 0, 140, 64, 64, 750, 175, 62, 62, 2);
npc_Map3dummyThree.setOptions("./img/NPC/girlThree.png", 0, 140, 64, 64, 770, 135, 62, 62, 2);
npc_Map3dummyFour.setOptions("./img/NPC/girlThree.png", 0, 140, 64, 64, 900, 400, 62, 62, 2);
npc_Map3dummyFive.setOptions("./img/NPC/Skeleton.png", 0, 140, 64, 64, 400, 500, 62, 62, 2);
npc_Map3dummySix.setOptions("./img/NPC/monk.png", 0, 140, 64, 64, 400, -20, 62, 62, 2);
npc_Map3Jay.setOptions("./img/NPC/guyTwo.png", 0, 140, 64, 64, 90, 180, 62, 62, 2);
npc_Map3SilentBob.setOptions("./img/NPC/guyThree.png", 0, 140, 64, 64, 50, 180, 62, 62, 2);

npc_Map4theChin.setOptions("./img/NPC/chin.png", 0, 140, 64, 64, 515,20, 62, 62, 0);
npc_Map4frontStudentOne.setOptions("./img/NPC/Skeleton.png", 0, 140, 64, 64, 440,20, 62, 62, 0);
npc_Map4frontStudentTwo.setOptions("./img/NPC/Skeleton.png", 0, 140, 64, 64, 440,100, 62, 62, 0);
npc_Map4middleStudentOne.setOptions("./img/NPC/Skeleton.png", 0, 140, 64, 64, 370,20, 62, 62, 0);
npc_Map4middleStudentTwo.setOptions("./img/NPC/Skeleton.png", 0, 140, 64, 64, 370,100, 62, 62, 0);
npc_Map4backStudentOne.setOptions("./img/NPC/Skeleton.png", 0, 140, 64, 64, 250,100, 62, 62, 0);

npc_Map5dummyOne.setOptions("./img/NPC/chin.png", 0, 140, 64, 64, 110,260, 62, 62, 0);
npc_Map5theFowler.setOptions("./img/NPC/chin.png", 0, 140, 64, 64, 20,20, 62, 62, 0);

npc_Map6lib.setOptions("./img/NPC/chin.png", 0, 140, 64, 64, 150,145, 62, 62, 0);

npc_Map7dummyOne.setOptions("./img/NPC/girlOne.png", 0, 140, 64, 64, 50, 700, 62, 62, 2);
npc_Map7dummyTwo.setOptions("./img/NPC/girlTwo.png", 0, 140, 64, 64, 170, 200, 62, 62, 2);
npc_Map7dummyThree.setOptions("./img/NPC/girlThree.png", 0, 140, 64, 64, 350, 580, 62, 62, 2);
npc_Map7dummyFour.setOptions("./img/NPC/monk.png", 0, 140, 64, 64, 150, 200, 62, 62, 2);

npc_Map8dummyOne.setOptions("./img/NPC/girlOne.png", 0, 140, 64, 64, 50, 700, 62, 62, 2);
npc_Map8dummyTwo.setOptions("./img/NPC/girlTwo.png", 0, 140, 64, 64, 150, 0, 62, 62, 2);
npc_Map8dummyThree.setOptions("./img/NPC/girlThree.png", 0, 140, 64, 64, 350, 580, 62, 62, 2);
npc_Map8dummyFour.setOptions("./img/NPC/monk.png", 0, 140, 64, 64, 500, 900, 62, 62, 2);

npc_Map10dummyOne.setOptions("./img/NPC/girlOne.png", 0, 140, 64, 64, 210, 260, 62, 62, 2);
npc_Map10dummyTwo.setOptions("./img/NPC/girlTwo.png", 0, 140, 64, 64, 340, 260, 62, 62, 2);
npc_Map10dummyThree.setOptions("./img/NPC/girlThree.png", 0, 140, 64, 64, 210, 180, 62, 62, 2);
npc_Map10dummyFour.setOptions("./img/NPC/monk.png", 0, 140, 64, 64, 340, 180, 62, 62, 2);
npc_Map10theAlden.setOptions("./img/NPC/alden.png", 0, 140, 64, 64, 530, 170, 62, 62, 2);

npc_Map10theAlden.puzzleName = "Alden";
npc_Map5theFowler.puzzleName = "Fowler";
npc_Map5dummyOne.puzzleName = "Ross";

npc_Alden.face = (function () {
    var temp = new Image();
    temp.src =  "./img/Alden-plain.png";
    return temp;
})();
console.log(npc_Alden.face);

//Faces
// alden_por.setOptions("./img/Alden-plain.png", 0, 0, 480, 638, 100, 100, 480, 638);

var background = new BackgroundObject();
var initialBackground = new Image();
initialBackground.src = "./img/ext_stairs_lower.jpg";
background.set(initialBackground);

var grid = new BackgroundObject();
var gridimage = new Image();
gridimage.src = "./img/32x32grid.png";
grid.set(gridimage);

npc_Map1StairWalker.image.onload = function() {
  npc_Map1StairWalker.load = true;
  npc_Map1Blocker.load = true;
  npc_Map1BottomWalker.load = true;
  npc_Map1dummyOne.load = true;
  npc_Map1dummyTwo.load = true;
  npc_Map1dummyThree.load = true;

  npc_Map2Cashier.load = true;
  npc_Map2Bookman.load = true;

  npc_Map3BottomWalker.load = true;
  npc_Map3dummyOne.load = true;
  npc_Map3dummyTwo.load = true;
  npc_Map3dummyThree.load = true;
  npc_Map3dummyFour.load = true;
  npc_Map3dummyFive.load = true;
  npc_Map3dummySix.load = true;
  npc_Map3Jay.load = true;
  npc_Map3SilentBob.load = true;

  npc_Map4theChin.load = true;
  npc_Map4frontStudentOne.load = true;
  npc_Map4frontStudentTwo.load = true;
  npc_Map4middleStudentOne.load = true;
  npc_Map4middleStudentTwo.load = true;
  npc_Map4backStudentOne.load = true;

  npc_Map5dummyOne.load = true;
  npc_Map5theFowler.load = true;

  npc_Map6lib.load = true;

  npc_Map7dummyOne.load = true;
  npc_Map7dummyTwo.load = true;
  npc_Map7dummyThree.load = true;
  npc_Map7dummyFour.load = true;

  npc_Map8dummyOne.load = true;
  npc_Map8dummyTwo.load = true;
  npc_Map8dummyThree.load = true;
  npc_Map8dummyFour.load = true;

  npc_Map10dummyOne.load = true;
  npc_Map10dummyTwo.load = true;
  npc_Map10dummyThree.load = true;
  npc_Map10dummyFour.load = true;
  npc_Map10theAlden.load = true;

};

/*
Map1(bottomStaircase) Npc update functions are below
Blocker - If the player gets close he block you from going around.
Stairwalker - Walks up and down the stairs.. like a normal person.
BottomWalker - Walks left to right at the bottom of the stairs.. like a normal person.
*/
npc_Map1StairWalker.face.src = "./img/people/dude1.png";
npc_Map1StairWalker.faceArray[0] = npc_Map1StairWalker.face;
npc_Map1StairWalker.faceArray[1] = npc_Map1StairWalker.face;
npc_Map1StairWalker.dialog[0] = "Your code for Fowler's class? Yeah, I looked at it. Your problem was at row 3, column 3. You should really fix that code.";
npc_Map1StairWalker.dialog[1] = "You really should add javadoc next time.";

npc_Map1dummyTwo.face.src = "./img/Chin-plain.png";
npc_Map1dummyTwo.faceArray[0] = npc_Map1dummyTwo.face;
npc_Map1dummyTwo.faceArray[1] = npc_Map1dummyTwo.face;
npc_Map1dummyTwo.dialog[0] = "Can you direct me to WCG?  I'm looking for Dr. Chinn.  He's lost his marbles...or was it spilled his fruit."
npc_Map1dummyTwo.dialog[1] = "Anyway, he needs some help solving this mystery.  I heard he gives easy A's."

npc_Map1dummyOne.face.src = "./img/Alden-plain.png";
npc_Map1dummyOne.faceArray[0] = npc_Map1dummyOne.face;
npc_Map1dummyOne.faceArray[1] = npc_Map1dummyOne.face;
npc_Map1dummyOne.dialog[0] = "Do you know where the Science Building is?  Professor Alden is up there exposing the inner workings of something called..."
npc_Map1dummyOne.dialog[1] = "computers, yeah that's it.  I heard there's a secret code to solving his puzzle."

npc_Map1dummyThree.face.src = "./img/Fowler-plain.png";
npc_Map1dummyThree.faceArray[0] = npc_Map1dummyThree.face;
npc_Map1dummyThree.faceArray[1] = npc_Map1dummyThree.face;
npc_Map1dummyThree.dialog[0] = "Professor Fowler is over in Cherry Parks.  He said my code is...how did he put it..."
npc_Map1dummyThree.dialog[1] = "'Your code is strange and unexpected. It is full of bugs.  Debug them if you can'"

npc_Map1BottomWalker.dialog[0] = "This stream of cars is never ending and the walk sign won't change! " +
                                 "I'll never be able to cross. I suggest you don't try either!";
npc_Map1BottomWalker.faceArray[0] = npc_Map1BottomWalker.face;
npc_Map1BottomWalker.face.src =  "./img/Robert.png";

npc_Map1Blocker.face.src = "./img/people/monika.png";
npc_Map1Blocker.faceArray[0] = npc_Map1Blocker.face;
npc_Map1Blocker.update = function(clockTick) {
  //console.log(this.talkTo);
  if(this.talkTo) {
    npc_Map1Blocker.dialog[0] = "Just go around me, why dontcha?";
  }
  if(!this.talkTo) {
    npc_Map1Blocker.dialog[0] = "Would you mind not blocking my path?";
  }
  if(player.y < 171) {
    if(W_KEY in keys || UP_KEY in keys) {
      this.spriteRoll(512, 8,  clockTick, 0.1);
      this.y = (player.y - 30);
    }
    if(S_KEY in keys || DOWN_KEY in keys) {
      this.spriteRoll(640, 8,  clockTick, 0.1);
      this.y = (player.y - 30);
    }
  }
};
npc_Map1dummyOne.update = function(clockTick) {
};
npc_Map1dummyTwo.update = function(clockTick) {
};
npc_Map1dummyThree.update = function(clockTick) {
};


var chinFlip = 0;
var chinCounter = 0;
var chinDirection = 0;

npc_Map1StairWalker.update = function(clockTick) {
  //console.log(player.y);
  //Checks to see if you are next to chin
  if(is_collide(this, player) && chinCounter === 0) {
    chinDirection = chinFlip;
    chinFlip = 3;
    chinCounter = 1;
  }

  //If you are next to chin then this happens.
  if(chinFlip === 3) {
    this.y += 0;
    if(chinDirection === 0) {
      this.spriteRoll(640, 1,  clockTick, 0.5);

    }
    if(chinDirection === 1) {
      this.spriteRoll(512, 1, clockTick, 0.5);
    }
    if(!is_collide(this, player)) {

      chinFlip = chinDirection;
    }
  }

  // You are not next to chin and he is walking south
  if(chinFlip === 0) {
    chinCounter = 0;
    this.spriteRoll(640, 8,  clockTick, 0.1);
    this.y += this.speed;

    if(this.y >= 700) {
      chinFlip = 1;
    }

  }

  // You are not next to chin and he is walking north
  if(chinFlip === 1) {
    chinCounter = 0;
    this.spriteRoll(512, 8, clockTick, 0.1);
    this.y -= this.speed;

    if(this.y <= 10) {
      chinFlip = 0;
    }
  }
};


var aldenFlip = 0;
var aldenCounter = 0;
var aldenDirection = 0;
npc_Map1BottomWalker.update = function(clockTick) {

  var aldenX = Math.floor(this.x/32) + 1;
  var aldenY = Math.floor(this.y/32) + 1

  //Checks to see if you are next to alden
  if(is_collide(this, player) && aldenCounter === 0) {
    aldenDirection = aldenFlip;
    aldenFlip = 3;
    aldenCounter = 1;
  }

  //If you are next to alden then this happens.
  if(aldenFlip === 3) {
    this.y += 0;
    if(aldenDirection === 0) {
      this.spriteRoll(704, 1,  clockTick, 0.5);

    }
    if(aldenDirection === 1) {
      this.spriteRoll(576, 1, clockTick, 0.5);

    }
    if(!is_collide(this, player)) {

      aldenFlip = aldenDirection;
    }
  }

  // You are not next to alden and he is walking west
  if(aldenFlip === 0) {
    aldenCounter = 0;
    this.spriteRoll(704, 8,  clockTick, 0.1);
    this.x += this.speed;

    if(this.x >= 450) {
      aldenFlip = 1;
    }

  }
  // You are not next to alden and he is walking east
  if(aldenFlip === 1) {
    aldenCounter = 0;
    this.spriteRoll(576, 8,  clockTick, 0.1);
    this.x -= this.speed;

    if(this.x <= 10) {
      aldenFlip = 0;
    }
  }
};

/*
Map2(BookStore) Npc update functions are below
Bookman - If the player gets close he looks for a book.
Cashier - If the player gets close he will check you out. *wink*
*/
npc_Map2Bookman.dialog[0] = "Donald Chinn taught me that a monkey can peel a Banana in O(log n) time.  That's pretty fast."
npc_Map2Bookman.update = function(clockTick) {
  //console.log(dist);
  if(is_collide(this, player)) {
    this.spriteRoll(780, 5,  clockTick, 0.3);
  } else {
    this.spriteRoll(780, 1,  clockTick, 0.3);
  }

};
npc_Map2Cashier.update = function(clockTick) {
  //console.log(dist);
  if(is_collide(this, player)) {
    this.spriteRoll(460, 8,  clockTick, 0.3);
  } else {
    this.spriteRoll(460, 1,  clockTick, 0.3);
  }

};

/*
Map3(walkWay) Npc update functions are below
dummyGroup - Just a bunch of friends talking and blocking the way.
dummyOne - the one on the far right
dummyTwo - the one furthest south
dummyThree - the one furthest north
bottomWalker - Walks left to right at the bottom of the stairs.. like a normal person.
*/

npc_Map3dummyOne.dialog[0] = "...and then I said...";
npc_Map3dummyOne.dialog[1] = "Would you mind? We are having a conversation about some cute boys.";
npc_Map3dummyOne.update = function(clockTick) {
  this.spriteRoll(576, 1,  clockTick, 0.1);
};
npc_Map3dummyTwo.dialog[0] = "Did he really say that?";
npc_Map3dummyTwo.update = function(clockTick) {
  this.spriteRoll(512, 1,  clockTick, 0.1);
};
npc_Map3dummyThree.dialog[0] = "He sounds so dreamy.";
npc_Map3dummyThree.update = function(clockTick) {
  this.spriteRoll(900, 1,  clockTick, 0.1);
};
npc_Map3dummyFour.face.src = "./img/people/Kirsten.png";
npc_Map3dummyFour.faceArray[0] = npc_Map3dummyFour.face;
npc_Map3dummyFour.dialog[0] = "A liger...it's pretty much my favorite animal. It's like a lion and a tiger mixed - bred for its skills in magic.";
npc_Map3dummyFour.update = function(clockTick) {
  this.spriteRoll(900, 1,  clockTick, 0.1);
};

npc_Map3dummyFive.face.src = "./img/people/dude2.png";
npc_Map3dummyFive.faceArray[0] = npc_Map3dummyFive.face;
npc_Map3dummyFive.faceArray[1] = npc_Map3dummyFive.face;
npc_Map3dummyFive.update = function(clockTick) {
  if(this.talkTo) {
    this.spriteRoll(704, 8,  clockTick, 0.1);
    this.x += this.speed;
  }
  if(!this.talkTo) {
    this.spriteRoll(900, 1,  clockTick, 0.1);
    npc_Map3dummyFive.dialog[0] = "Wait, when does this happen? Now?"
    npc_Map3dummyFive.dialog[1] = "You mean what I’m doing now is actually happening right now?"
  }
};
npc_Map3dummySix.face.src = "./img/people/Daniel.png";
npc_Map3dummySix.faceArray[0] = npc_Map3dummySix.face;
npc_Map3dummySix.faceArray[1] = npc_Map3dummySix.face;
npc_Map3dummySix.dialog[0] = "Have you seen that girl known as Jenny?"
npc_Map3dummySix.dialog[1] = "I hear her song is really catchy."
npc_Map3dummySix.update = function(clockTick) {
  this.spriteRoll(900, 1,  clockTick, 0.1);
};

// Kirsten and Loren veto'd cussing. We found a different jay/silent bob quote.
npc_Map3Jay.face.src =  "./img/people/Joel.png";
npc_Map3Jay.dialog[0] = "See those two over there? Yeah, they had a Star Wars themed wedding. ";
npc_Map3Jay.dialog[1] = ".......";
npc_Map3Jay.dialog[2] = "AND they tied the knot dressed as Storm Troopers!";
npc_Map3Jay.faceArray[0] = npc_Map3Jay.face;
npc_Map3Jay.faceArray[1] = npc_Map3SilentBob.face;
npc_Map3Jay.faceArray[2] = npc_Map3Jay.face;

npc_Map3SilentBob.faceSpot = 1;
npc_Map3SilentBob.face.src =  "./img/people/Aaron.png";
npc_Map3SilentBob.dialog[0] = "See those two over there? Yeah, they had a Star Wars themed wedding. ";
npc_Map3SilentBob.dialog[1] = ".......";
npc_Map3SilentBob.dialog[2] = "AND they tied the knot dressed as Storm Troopers!";
npc_Map3SilentBob.faceArray[0] = npc_Map3Jay.face;
npc_Map3SilentBob.faceArray[1] = npc_Map3SilentBob.face;
npc_Map3SilentBob.faceArray[2] = npc_Map3Jay.face;


npc_Map3Jay.update = function(clockTick) {
  this.spriteRoll(900, 1,  clockTick, 0.1);
};


npc_Map3SilentBob.update = function(clockTick) {
  this.spriteRoll(900, 1,  clockTick, 0.1);
}
npc_Map3BottomWalker.face.src =  "./img/people/dude5.png";
npc_Map3BottomWalker.faceArray[0] = npc_Map3BottomWalker.face;
npc_Map3BottomWalker.faceArray[1] = npc_Map3BottomWalker.face;
npc_Map3BottomWalker.dialog[0] = "I took a look at your code for Fowler; I'm pretty sure you'll want to make changes to row 2, column 4."
npc_Map3BottomWalker.dialog[1] = "But you didn't hear that from me!"
npc_Map3BottomWalker.update = function(clockTick) {

  var aldenX = Math.floor(this.x/32) + 1;
  var aldenY = Math.floor(this.y/32) + 1

  //Checks to see if you are next to alden
  if(is_collide(this, player) && aldenCounter === 0) {
    aldenDirection = aldenFlip;
    aldenFlip = 3;
    aldenCounter = 1;
  }

  //If you are next to alden then this happens.
  if(aldenFlip === 3) {
    this.y += 0;
    if(aldenDirection === 0) {
      this.spriteRoll(704, 1,  clockTick, 0.5);

    }
    if(aldenDirection === 1) {
      this.spriteRoll(576, 1, clockTick, 0.5);

    }
    if(!is_collide(this, player)) {

      aldenFlip = aldenDirection;
    }
  }

  // You are not next to alden and he is walking east
  if(aldenFlip === 0) {
    aldenCounter = 0;
    this.spriteRoll(704, 8,  clockTick, 0.1);
    this.x += this.speed;

    if(this.x >= 900) {
      aldenFlip = 1;
    }

  }
  // You are not next to alden and he is walking west
  if(aldenFlip === 1) {
    aldenCounter = 0;
    this.spriteRoll(576, 8,  clockTick, 0.1);
    this.x -= this.speed;

    if(this.x <= 10) {
      aldenFlip = 0;
    }
  }
};
npc_Map4theChin.face.src = "./img/Chin-plain.png"
npc_Map4theChin.faceArray[0] = npc_Map4theChin.face;
npc_Map4theChin.faceArray[1] = npc_Map4theChin.face;
npc_Map4theChin.dialog[0] = "Uh.. I haven't finished my final exam quite yet."
npc_Map4theChin.dialog[1] = "Visit me after final week and I might have an exam for you."
npc_Map4theChin.update = function (clockTick) {

}
npc_Map4frontStudentOne.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}
npc_Map4frontStudentTwo.dialog[0] = "One annoying orange, is O(1) too many";
npc_Map4frontStudentTwo.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}
npc_Map4middleStudentOne.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}
npc_Map4middleStudentTwo.dialog[0] = "Gillmore girls is my favorite show too!";
npc_Map4middleStudentTwo.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}
npc_Map4backStudentOne.dialog[0] = "What's the deal with corn nuts?";
npc_Map4backStudentOne.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}

npc_Map5dummyOne.update = function (clockTick) {
  this.spriteRoll(512, 1, clockTick, 0.1);
}
npc_Map5theFowler.update = function(clockTick) {

}
npc_Map6lib.face.src = "./img/people/dude6.png";
npc_Map6lib.faceArray[0] = npc_Map6lib.face;
npc_Map6lib.dialog[0] = "Yeah, yeah, I looked over your code. What a mess! You better make changes to row 5, column 2 before you turn that in to Fowler!"
npc_Map6lib.update = function(clockTick) {
}
npc_Map7dummyOne.face.src = "./img/people/gal1.png";
npc_Map7dummyOne.faceArray[0] = npc_Map7dummyOne.face;
npc_Map7dummyOne.dialog[0] = "These schnazberries taste like schnazberries!. I could eat O(n!) schnazberries."
npc_Map7dummyOne.update = function(clockTick) {
}
npc_Map7dummyTwo.face.src = "./img/people/dudes.png";
npc_Map7dummyTwo.faceArray[0] = npc_Map7dummyTwo.face;
npc_Map7dummyTwo.dialog[0] = "I like O(n) green apples and ham.  Sam prefers blueberries.  He has O(n^2) of them!"
npc_Map7dummyTwo.update = function(clockTick) {
}
npc_Map7dummyThree.face.src = "./img/people/Dylan.png";
npc_Map7dummyThree.faceArray[0] = npc_Map7dummyThree.face;
npc_Map7dummyThree.faceArray[1] = npc_Map7dummyThree.face;
npc_Map7dummyThree.dialog[0] = "la, la, la, 867-5309. What was the rest of the song!?";
npc_Map7dummyThree.dialog[1] = "That number would make an awesome secret code though.";
npc_Map7dummyThree.update = function(clockTick) {
}
npc_Map7dummyFour.face.src = "./img/people/dudes.png";
npc_Map7dummyFour.faceArray[0] = npc_Map7dummyFour.face;
npc_Map7dummyFour.dialog[0] = "I have O(n^2) blueberries.  Katie prefers green apples and ham.  She has O(n) of them!"
npc_Map7dummyFour.update = function(clockTick) {
}
npc_Map8dummyOne.face.src = "./img/people/dude7.png";
npc_Map8dummyOne.faceArray[0] = npc_Map8dummyOne.face;

npc_Map8dummyFour.face.src = "./img/people/dude3.png";
npc_Map8dummyFour.faceArray[0] = npc_Map8dummyFour.face;

npc_Map8dummyThree.face.src = "./img/people/dude4.png";
npc_Map8dummyThree.faceArray[0] = npc_Map8dummyThree.face;

npc_Map8dummyOne.dialog[0] ="Flying chickens in a barnyard!";
npc_Map8dummyTwo.dialog[0] = "When you can balance a tack hammer on your head, you will head off your foes with a balanced attack";
npc_Map8dummyThree.dialog[0] = "The early bird might get the worm, but the second mouse gets the cheese.";
npc_Map8dummyFour.dialog[0] = "Nostalgia isn't what it used to be.";
npc_Map8dummyOne.update = function(clockTick) {
}
npc_Map8dummyTwo.update = function(clockTick) {
}
npc_Map8dummyThree.update = function(clockTick) {
}
npc_Map8dummyFour.update = function(clockTick) {

}
npc_Map10dummyOne.dialog[0] = "Looks like Mobus is sitting in our class for some reason today.";
npc_Map10dummyTwo.dialog[0] = "Man this diagram, I just can't understand it... Maybe I should't be a Computer Science Major.";
npc_Map10dummyThree.dialog[0] = "Do you have the code?.. I don't";
npc_Map10dummyThree.dialog[1] = "Apparently someone on or near the staircase knows it.";
npc_Map10dummyFour.dialog[0] = "I'm a mog - half man, half dog. I'm my own best friend.";

npc_Map10dummyOne.update = function(clockTick) {
}
npc_Map10dummyTwo.update = function(clockTick) {
}
npc_Map10dummyThree.update = function(clockTick) {
}
npc_Map10dummyFour.update = function(clockTick) {

}
npc_Map10theAlden.update = function(clockTick) {
  if(g.puzzleWins[0] === true) {
    npc_Map10theAlden.dialog[0] = "The code, you have it...";
    npc_Map10theAlden.dialog[1] = "keep it secret, keep it safe."
  }
}

/** When player's spritesheet loads in browser, sets player.load to true. */
player.image.onload = function() {
    player.load = true;

    /** Hooks position the player's image relative to player's x,y values.
     * This offset is necessary due to the sprite sheet's alignment. */
    player.y_hook = player.dty / 2 + 8;
    player.x_hook = (player.dtx / 4 ) + 1  ;
};

/** When background's spritesheet loads in browser, sets background.load to true. */
background.image.onload = function() {
  background.load = true;
};
grid.image.onload = function() {
    grid.load = true;
};

/**
 * TODO: Explain this object.
 * @constructor
 */
function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
    this.maxTime = 301;
    this.isPaused = false;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
};

Timer.prototype.render = function () {
    timerctx.save();
    timerctx.font = "50px sans-serif";
    timerctx.fillStyle = "#ffffff";
    var timeRemaining = "0:00";
    if (this.gameTime <= this.maxTime) {
        timeRemaining = Math.floor((this.maxTime - this.gameTime) / 60) + ":" +
            Math.floor(((this.maxTime - this.gameTime) % 60) / 10) +
            Math.floor((this.maxTime - this.gameTime) % 60) % 10;
    } else {
        g.gameOver = true;
    }
    timerctx.fillText(timeRemaining, topcanvas.width - 110, 50);
    timerctx.restore();
};

/**
 * TODO: Explain this object.
 * @constructor
 */

var interactNPC;

/**
 * Handles drawing the correct controller button at the appropriate moments.
 * @constructor
 */
var Controller = function() {
    this.load = false;

    /** Really wishing I had an asset manager right about now. Or a single button spritesheet! HAHAHA. */
    var interactionButton_up = new Image();
    interactionButton_up.src = './img/controls/doButtonInactive.png';
    interactionButton_up.onload = function () { interactionButton_up.load = true; };

    var sButton_up = new Image();
    sButton_up.src = './img/controls/button_S.png';
    sButton_up.onload = function () { sButton_up.load = true; };

    var aButton_up = new Image();
    aButton_up.src = './img/controls/button_A.png';
    aButton_up.onload = function () { aButton_up.load = true; };

    var dButton_up = new Image();
    dButton_up.src = './img/controls/button_D.png';
    dButton_up.onload = function () { dButton_up.load = true; };

    var wButton_up = new Image();
    wButton_up.src = './img/controls/button_W.png';
    wButton_up.onload = function () { wButton_up.load = true; };

    var interactionButton_down = new Image();
    interactionButton_down.src = './img/controls/doButtonActive.png';
    interactionButton_down.onload = function () { interactionButton_down.load = true; };

    var sButton_down = new Image();
    sButton_down.src = './img/controls/pressed_S.png';
    sButton_down.onload = function () { sButton_down.load = true; };

    var aButton_down = new Image();
    aButton_down.src = './img/controls/pressed_A.png';
    aButton_down.onload = function () { aButton_down.load = true; };

    var dButton_down = new Image();
    dButton_down.src = './img/controls/pressed_D.png';
    dButton_down.onload = function () { dButton_down.load = true; };

    var wButton_down = new Image();
    wButton_down.src = './img/controls/pressed_W.png';
    wButton_down.onload = function () { wButton_down.load = true; };

    this.render = function() {
        if (this.load === false) { // check to see if the non-pressed buttons are loaded.
            if (interactionButton_up.load === true && sButton_up.load === true &&
                aButton_up.load === true && dButton_up.load === true && wButton_up.load === true) {
                this.load = true;
            }
        }

        if (this.load) {
            /** Check if the key is currently pressed or not */
            var styled_interact = (interactNPC !== undefined) ? interactionButton_down : interactionButton_up;
            var styled_w = (W_KEY in keys || UP_KEY in keys) ? wButton_down : wButton_up;
            var styled_a = (A_KEY in keys || LEFT_KEY in keys) ? aButton_down: aButton_up;
            var styled_s = (S_KEY in keys || DOWN_KEY in keys) ? sButton_down : sButton_up;
            var styled_d = (D_KEY in keys || RIGHT_KEY in keys) ? dButton_down : dButton_up;

            topctx.drawImage(styled_interact, 0, 0,
                styled_interact.width, styled_interact.height,
                topcanvas.width - (interactionButton_up.width * 1.5),
                topcanvas.height - (interactionButton_up.height * 1.2),
                interactionButton_up.width, interactionButton_up.height);

            topctx.drawImage(styled_w, 0, 0, wButton_up.width, wButton_up.height,
                (wButton_up.width * 1.5), topcanvas.height - (wButton_up.height * 2),
                wButton_up.width, wButton_up.height);


            topctx.drawImage(styled_s, 0, 0, sButton_up.width, sButton_up.height,
                (sButton_up.width * 1.5), topcanvas.height - sButton_up.height,
                sButton_up.width, sButton_up.height);


            topctx.drawImage(styled_a, 0, 0, aButton_up.width, aButton_up.height,
                (aButton_up.width * 0.5), topcanvas.height - (aButton_up.height * 1.5),
                aButton_up.width, aButton_up.height);


            topctx.drawImage(styled_d, 0, 0, dButton_up.width, dButton_up.height,
                (dButton_up.width * 2.5), topcanvas.height - (dButton_up.height * 1.5),
                dButton_up.width, dButton_up.height);

            /** old code. */ //TODO: delete this old code
            //if (interactNPC === undefined) {
            //    interactionButton_up.src = './img/doButtonInactive.png';
            //    topctx.drawImage(interactionButton_up, 0, 0,
            //        interactionButton_up.width, interactionButton_up.height,
            //        topcanvas.width - (interactionButton_up.width * 1.5),
            //        topcanvas.height - (interactionButton_up.height * 1.2),
            //        interactionButton_up.width, interactionButton_up.height);
            //}
            //if (interactNPC !== undefined) {
            //    interactionButton_up.src = './img/doButtonActive.png';
            //    topctx.drawImage(interactionButton_up, 0, 0,
            //        interactionButton_up.width, interactionButton_up.height,
            //        topcanvas.width - (interactionButton_up.width * 1.5),
            //        topcanvas.height - (interactionButton_up.height * 1.2),
            //        interactionButton_up.width, interactionButton_up.height);
            //}
            //
            //if (W_KEY in keys || UP_KEY in keys) {
            //    wButton_up.src = './img/pressed_W.png';
            //    topctx.drawImage(wButton_up, 0, 0, wButton_up.width, wButton_up.height,
            //        (wButton_up.width * 1.5),
            //        topcanvas.height - (wButton_up.height * 2),
            //        wButton_up.width, wButton_up.height);
            //} else {
            //    wButton_up.src = './img/button_W.png';
            //    topctx.drawImage(wButton_up, 0, 0, wButton_up.width, wButton_up.height,
            //        (wButton_up.width * 1.5),
            //        topcanvas.height - (wButton_up.height * 2),
            //        wButton_up.width, wButton_up.height);
            //}
            //
            //if (S_KEY in keys || DOWN_KEY in keys) {
            //    sButton_up.src = './img/pressed_S.png';
            //    topctx.drawImage(sButton_up, 0, 0, sButton_up.width, sButton_up.height,
            //        (sButton_up.width * 1.5),
            //        topcanvas.height - sButton_up.height, sButton_up.width, sButton_up.height);
            //} else {
            //    sButton_up.src = './img/button_S.png';
            //    topctx.drawImage(sButton_up, 0, 0, sButton_up.width, sButton_up.height,
            //        (sButton_up.width * 1.5),
            //        topcanvas.height - sButton_up.height, sButton_up.width, sButton_up.height);
            //}
            //
            //if (A_KEY in keys || LEFT_KEY in keys) {
            //    aButton_up.src = './img/pressed_A.png';
            //    topctx.drawImage(aButton_up, 0, 0, aButton_up.width, aButton_up.height,
            //        (aButton_up.width * .5),
            //        topcanvas.height - (aButton_up.height * 1.5),
            //        aButton_up.width, aButton_up.height);
            //} else {
            //    aButton_up.src = './img/button_A.png';
            //    topctx.drawImage(aButton_up, 0, 0, aButton_up.width, aButton_up.height,
            //        (aButton_up.width * .5),
            //        topcanvas.height - (aButton_up.height * 1.5),
            //        aButton_up.width, aButton_up.height);
            //}
            //if (D_KEY in keys || RIGHT_KEY in keys) {
            //    dButton_up.src = './img/pressed_D.png';
            //    topctx.drawImage(dButton_up, 0, 0, dButton_up.width, dButton_up.height,
            //        (dButton_up.width * 2.5),
            //        topcanvas.height - (dButton_up.height * 1.5),
            //        dButton_up.width, dButton_up.height);
            //} else {
            //    dButton_up.src = './img/button_D.png';
            //    topctx.drawImage(dButton_up, 0, 0, dButton_up.width, dButton_up.height,
            //        (dButton_up.width * 2.5),
            //        topcanvas.height - (dButton_up.height * 1.5),
            //        dButton_up.width, dButton_up.height);
            //}
        }
    };
};

var controller = new Controller();


var Game = function() {
    /** Game-wide debugger flag. */
    this.debug = false;
    console.log("DEBUG IS OFF. Hit the Tilde (~ `) key to turn it on!");
    /** Tracks if game is currently in a paused state. */
    this.isPaused = false;
    /** The ID number of the currently loaded zone. */
    this.currentZone;
    /** Set to "true" if the player has triggered gameover and game needs to be reset. */
    this.gameOver = false;
    /** Represents which puzzles have been flagged as completed. */
    this.puzzleWins = [false, false, false];
    /** Defined only while a puzzle is currently active. */
    this.currentPuzzle = undefined;

    /** Array of queued actions. Sets isPaused to true when queuedActions length is > 0. */
    this.queuedActions = [];
    /** Creating an array of arrays for the entites. */
    this.entiteZones = [];

    /**
     * I made it so that at each index it would hold the entities
     * for the appropriate zone
     */
    this.entiteZones[1] = this.zoneOneEntites = [];
    this.entiteZones[2] = this.zoneTwoEntites = [];
    this.entiteZones[3] = this.zoneThreeEntites = [];
    this.entiteZones[4] = this.zoneFourEntites = [];
    this.entiteZones[5] = this.zoneFiveEntites = [];
    this.entiteZones[6] = this.zoneSixEntites = [];
    this.entiteZones[7] = this.zoneSevenEntites = [];
    this.entiteZones[8] = this.zoneEightEntites = [];
    this.entiteZones[9] = this.zoneNineEntites = [];
    this.entiteZones[10] = this.zoneTenEntites = [];

    /**
     * Collection of methods to handle adding entities to specific zones.
     * @param entity
     */
    this.addEntityZoneOne = function (entity) {
        this.zoneOneEntites.push(entity);
    };
    this.addEntityZoneTwo = function (entity) {
        this.zoneTwoEntites.push(entity);
    };
    this.addEntityZoneThree = function (entity) {
        this.zoneThreeEntites.push(entity);
    };
    this.addEntityZoneFour = function (entity) {
        this.zoneFourEntites.push(entity);
    };
    this.addEntityZoneFive = function (entity) {
        this.zoneFiveEntites.push(entity);
    };
    this.addEntityZoneSix = function (entity) {
        this.zoneSixEntites.push(entity);
    };
    this.addEntityZoneSeven = function (entity) {
        this.zoneSevenEntites.push(entity);
    };
    this.addEntityZoneEight = function (entity) {
        this.zoneEightEntites.push(entity);
    };
    this.addEntityZoneNine = function (entity) {
        this.zoneNineEntites.push(entity);
    };
    this.addEntityZoneTen = function (entity) {
        this.zoneTenEntites.push(entity);
    };

    /**
     * Fetches a zone's data by it's ID and loads it in. This will update the
     * background's image and updates the sign_screen_bounds array. Optionally,
     * you can pass the grid coordinates for the player and it will update that
     * information as well.
     * @param id The id of the zone to load in.
     * @param new_player_x The new x grid location for the player.
     * @param new_player_y The new y grid location for the player.
     */
    this.loadZone = function (id, new_player_x, new_player_y) {

        if (new_player_x !== undefined) {
            player.x = new_player_x * 32;
        }
        if (new_player_y !== undefined) {
            player.y = new_player_y * 32;
        }

        if (id === undefined) {
            console.log("ERROR: No zone id was passed. Unable to load zone!");
        } else {

            /** insert cool code to go to black screen briefly here... */
            if (this.currentZone !== undefined) { // don't show on the first load
                g.timer.isPaused = true;
                g.isPaused = true;
                loadctx.fillStyle = "#000000";
                loadctx.fillRect(0, 0, topcanvas.width, topcanvas.height);
                loadctx.font = "25px sans-serif";
                loadctx.fillStyle = "#ffffff";
                loadctx.fillText("Loading...", loadcanvas.width / 1.5,
                                               loadcanvas.height - (loadcanvas.height / 5));
                setTimeout(function () {
                    loadctx.clearRect(0, 0, loadcanvas.width, loadcanvas.height);
                    g.isPaused = false;
                    g.timer.isPaused = false;
                }, 300);
            }

            this.currentZone = window.uwetech.zones[id];
            background.set(this.currentZone.image);
            sign_screen_bounds = this.currentZone.bounds;
            // alert the npcs of zone change?
        }

    };

    /**
     * Triggers when the window "hears" a key down event.
     * @param key_id The int value of the key that triggered this event.
     */
    this.handleKeyDownEvent = function (key_id) {
        console.log(key_id);
        // 87, 83, 65, 68, 32
        if (key_id === SPACE_KEY || key_id === ENTER_KEY) { // Spacebar
            player.interact(interactNPC);
            console.log("space");
            //g.loadZone(2, 1, 8); // kirsten debug, tested zone loading via button press
        } else if (key_id === W_KEY || key_id === UP_KEY) {
            // player.facing = "north";
        } else if (key_id === A_KEY || key_id === LEFT_KEY) {
            // player.facing = "west";
        } else if (key_id === S_KEY || key_id === DOWN_KEY) {
            // player.facing = "south";
        } else if (key_id === D_KEY || key_id === RIGHT_KEY) {
            // player.facing = "east";
        } else if (key_id === DEBUG_KEY) {
            if (g.debug === true) {
                g.debug = false;
                console.log("DEBUG OFF");
            } else {
                g.debug = true;
                console.log("DEBUG ON");
            }
        } else if (key_id === ESC_KEY){
            console.log("O!!");
            if (g.queuedActions.length === 0) {
                var message = "                             Report Card          " +
                    "[";
                message = (g.puzzleWins[0]) ? message + "PASS" : message + "FAIL";
                message = message + "] Alden's Final                           " +
                "[";
                // message = (g.puzzleWins[1]) ? message + "PASS" : message + "FAIL";
                // message = message + "] Chinn's Final                           " +
                // "[";
                message = (g.puzzleWins[2]) ? message + "PASS" : message + "FAIL";
                message = message + "] Fowler's Final                            ";
                message = message + "                                                   ";
                message = message + "You must pass all finals to earn your degree!";
                console.log(message);
                g.queuedActions.push((function (message) {
                    return function () {
                        window.uwetech.dialog.showInner(message);
                    };
                })(message));
                g.queuedActions.push(function () {window.uwetech.dialog.hide();});
            }
            player.checkQueue();
        } else if (key_id === P_KEY && g.debug === true) {
            g.isPaused = true;
            g.currentPuzzle = uwetech.puzzle_alden;

        } else if (key_id === O_KEY && g.debug === true) {
            g.isPaused = true;
            g.currentPuzzle = uwetech.puzzle_fowler;
            //console.log("O!!");
            //var message = "                             Report Card          " +
            //    "[";
            //message = (g.puzzleWins[0]) ? message + "PASS" : message + "FAIL";
            //message = message + "] Alden's Final                           " +
            //    "[";
            //message = (g.puzzleWins[1]) ? message + "PASS" : message + "FAIL";
            //message = message + "] Chinn's Final                           " +
            //    "[";
            //message = (g.puzzleWins[2]) ? message + "PASS" : message + "FAIL";
            //message = message + "] Fowler's Final                            ";
            //message = message + "                                                   ";
            //message = message + "You must pass all three finals to earn your degree!";
            ////console.log(message);
            //window.uwetech.dialog.showInner(message);

        }    else {
            // do nothing
        }

    };

    /**
     * Triggers when the window "hears" a key up event.
     * @param key_id
     */
    this.handleKeyUpEvent = function (key_id) {
        // did we want to track when a key is released??
    };

    /**
     * Triggers when the mouse canvas "hears" a mouse down event.
     * @param mousePos .x and .y of mouse's location
     */
    this.handleMouseDown = function (mousePos) {
        if (this.currentPuzzle !== undefined) {
            this.currentPuzzle.handleMouseDown(mousePos);
        }
    };

    /**
     * TODO: Describe this function.
     */
    this.start = function() {

      this.cam  = new Camera();
      this.cam.setup(player);
      this.timer = new Timer();
      this.loadZone(1, 10, 27); // player starts in zone 1 at x=10, y=27
      this.loop();
    };

    /**
     * This method is called on every screen refresh the browser alerts us about.
     * There is no guarantee how often this is called. As per mozilla.org:
     *
     * "The number of callbacks is usually 60 times per second, but will generally
     * match the display refresh rate in most web browsers as per W3C recommendation.
     * The callback rate may be reduced to a lower rate when running in background tabs."
     */
    this.loop = function() {
        if (g.gameOver === true) {
            g.restartGame();
        }

        var elapsedTime = 0;
        if (this.timer.isPaused === false) {
            elapsedTime = this.timer.tick();
            timerctx.clearRect(0, 0, timercanvas.width, timercanvas.height);
            this.timer.render();
        }

        if (g.currentPuzzle !== undefined) {
            g.currentPuzzle.update(elapsedTime);
            g.currentPuzzle.render();
        }

        if (g.isPaused === false) {
            this.update(elapsedTime);
            this.render();
        }
        requestAnimFrame(this.loop.bind(this));
    };

    /**
     * TODO: Describe this function.
     * @param clockTick
     */
    this.update = function(clockTick) {
        this.cam.getPosition(player);
        interactNPC = undefined;
        //console.log(this.puzzleWins);
        //player.bounds();
        player.movePlayer(clockTick);
        player.check_units();

        /*
         Get the current zone you are in and draw the entites
         */

        if (this.currentZone.id <= this.entiteZones.length) { // kirsten adding in catches
            var getEntityArray = this.entiteZones[this.currentZone.id]

            if (getEntityArray !== undefined) { // kirsten adding in catches
                var entitiesCount = getEntityArray.length;
                for (var i = 0; i < entitiesCount; i++) {
                    var entity = getEntityArray[i];

                    entity.update(clockTick);
                }
            }
        }
    };

    /**
     * Handles rendering the game.
     */
    this.render = function() {
        topctx.clearRect(0, 0, topcanvas.width, topcanvas.height);
        controller.render();

        midctx.clearRect(0, 0, midcanvas.width, midcanvas.height);
        midctx.save();
        midctx.translate(this.cam.x, this.cam.y);
        var getEntityArray = this.entiteZones[this.currentZone.id]

       if (getEntityArray !== undefined) {
           var entitiesCount = getEntityArray.length;
       }

        /*
        Get the current zone you are in and draw the entites
        */

        for (var i = 0; i < entitiesCount; i++) {
            var entity = getEntityArray[i];
            if(entity.load) {
              entity.render();
              if (g.debug === true) {
                  /** draws the bounding box for the player sprite */
                  midctx.strokeRect(entity.x + 15.5, entity.y + 40.5, 29, 24);
              }
            }
        }
        /** Only render things whose image is loaded in browser! */
        if (background.load) {
            //btmctx.clearRect(0, 0, btmcanvas.width, btmcanvas.height);
            background.renderBackground(this.cam.x * - 1, this.cam.y * - 1);
        }

        if (grid.load && g.debug === true) {
            grid.renderBackground(this.cam.x * - 1, this.cam.y * -1);
            grid.debugOn(this.cam.x * - 1, this.cam.y * - 1);
        }

        if (player.load) {

            player.render();

            if (g.debug === true) {
                /** draws the bounding box for the player sprite */
                midctx.strokeRect(player.x +0.5, player.y +0.5, 29, 24);
            }
        }

        midctx.restore();
    };

    /**
     * TODO: This function needs to be completed.
     * Call this method to re-initialize the game's state. Useful
     * for when a game-over occurs and the game needs to restart.
     */
    this.restartGame = function() {

        this.gameOver = false;

        /**
         * NOTE: Anything that can change state needs to be reset after a game over.
         * If you notice anything missing from this list, add it! */


        /** 1) Timer needs to be reset. */
        // TODO: I think this will reset the timer :-)
        this.timer.gameTime = 0;
        this.timer.wallLastTimestamp = 0;

        /** 2) Reset the win conditions back to none. */
        this.puzzleWins[0] = false;
        this.puzzleWins[1] = false;
        this.puzzleWins[2] = false;
        this.currentPuzzle = undefined;

        /** 3) Reset the queued actions array. */
        this.queuedActions = [];

        /** 4) Reset all of the NPCS back to initial state. */
        // TODO: Can someone show me how to reset the npcs?

        /** 5) Reset Spriteroll state. (?)   */
        // TODO: Do we need to reset the player or npcs's sprite roll animation state thing?

        /** 6)    */


        /** 7)    */


        /** 8) Play the quick-start opening cutscene. */
        // TODO: This code doesn't exist yet. Add it here once it does.

        /** 9) Player needs to be sent back to the starting zone. */
        this.currentZone = undefined; // when undefined, prevents loading screen.
        this.loadZone(1, 10, 27); // player starts in zone 1 at x=10, y=27

        /** 10) Un-pause the timer and game. */  // TODO: Not sure if we need this or not.
        g.isPaused = false;
        g.timer.isPaused = false;

    };

};


/**
 * TODO: Describe this stuff.
 */
var g = new Game();
var m = new math();
g.start();

/*
I am adding the entities to each zone array
ZoneOne is getting Map1 entities and
ZoneTwo is getting Map2 entities.
*/
g.addEntityZoneOne(npc_Map1Blocker);
g.addEntityZoneOne(npc_Map1BottomWalker);
g.addEntityZoneOne(npc_Map1StairWalker);
g.addEntityZoneOne(npc_Map1dummyOne);
g.addEntityZoneOne(npc_Map1dummyTwo);
g.addEntityZoneOne(npc_Map1dummyThree);

g.addEntityZoneTwo(npc_Map2Bookman);
g.addEntityZoneTwo(npc_Map2Cashier);

g.addEntityZoneThree(npc_Map3BottomWalker);
g.addEntityZoneThree(npc_Map3dummyOne);
g.addEntityZoneThree(npc_Map3dummyTwo);
g.addEntityZoneThree(npc_Map3dummyThree);
g.addEntityZoneThree(npc_Map3dummyFour);
g.addEntityZoneThree(npc_Map3dummyFive);
g.addEntityZoneThree(npc_Map3dummySix);
g.addEntityZoneThree(npc_Map3Jay);
g.addEntityZoneThree(npc_Map3SilentBob);


g.addEntityZoneFour(npc_Map4theChin);
g.addEntityZoneFour(npc_Map4frontStudentOne);
g.addEntityZoneFour(npc_Map4frontStudentTwo);
g.addEntityZoneFour(npc_Map4middleStudentOne);
g.addEntityZoneFour(npc_Map4middleStudentTwo);
g.addEntityZoneFour(npc_Map4backStudentOne);

g.addEntityZoneFive(npc_Map5dummyOne);
g.addEntityZoneFive(npc_Map5theFowler);

g.addEntityZoneSix(npc_Map6lib);

g.addEntityZoneSeven(npc_Map7dummyOne);
g.addEntityZoneSeven(npc_Map7dummyTwo);
g.addEntityZoneSeven(npc_Map7dummyThree);
g.addEntityZoneSeven(npc_Map7dummyFour);

g.addEntityZoneEight(npc_Map8dummyOne);
g.addEntityZoneEight(npc_Map8dummyTwo);
g.addEntityZoneEight(npc_Map8dummyThree);
g.addEntityZoneEight(npc_Map8dummyFour);

g.addEntityZoneTen(npc_Map10dummyOne);
g.addEntityZoneTen(npc_Map10dummyTwo);
g.addEntityZoneTen(npc_Map10dummyThree);
g.addEntityZoneTen(npc_Map10dummyFour);
g.addEntityZoneTen(npc_Map10theAlden);



/** Notes for Kirsten to keep track of stuff. */
// Things that a single gamestate object might  be useful for tracking
// currentZone = window.uwetech.zones[1];
// player.x, player.y
// winning progress (booleans of passedChinn, passedAlden, etc)
//

/**
// Steps to load a zone (and correctly update the game state)
 1 realize you've triggered an exit.
 2 determine what exit.     var exit = currentZone[exits][player.x + "," + player.y]
 3 identify zone id to go to.   var new_zone_id = exit[go_to_zone]
 4 set player's new x and y locations. player.x = exit[x_entrance] player.y = exit[y_entrance]
 5 call loadzone(new_zone_id) method.    loadzone(new_zone_id)
 5b. fetch zone object by it's id.     currentZone = window.uwetech.zones[id]
 6. update the following:
        background.set(currentZone.image)
        // height? width? what uses this?? bounds?
        sign_screen_bounds = currentZone[bounds]
        // somehow alert NPC stuff that the zone changed. Should they be checking? or should
        // a zone somehow store who its npcs are? Does THEIR state need to reset too? Errrm...
 */

window.uwetech.game = g;
