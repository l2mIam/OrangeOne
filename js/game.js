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
    g.handleKeyDown(e.keyCode);
});

window.addEventListener('keyup', function (e) {
    g.handleKeyUp(e.keyCode);
});

/** Array containing all currently pressed keys. This is for animations/movement. */
var keys = window.uwetech.Input.keys; // code is in input.js

//  constants!     W 87, S 83, A 65, D 68, space 32
var W_KEY = 87;
var S_KEY = 83;
var A_KEY = 65;
var D_KEY = 68;
var SPACE_KEY = 32;
var DEBUG_KEY = 192;  // ` key ~ key  is the debug key

//var dialogs = []; // TODO: What is this?

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

//
//// TODO: Remove Dialog and instead use window.uwetech.show/hide in dialoghelper.js
//var Dialog = function() {
//  this.load = false;
//  this.imgX = 0;
//
//  this.setOptions = function(src, srcX, srcY, dtx, dty, x, y, width, height) {
//          this.srcX = srcX;
//          this.srcY = srcY;
//          this.dtx = dtx;
//          this.dty = dty;
//          this.x = x;
//          this.y = y;
//          this.width = width;
//          this.height = height;
//          this.draw = false;
//
//          this.image = new Image();
//          this.image.src = src;
//          //console.log(" " + src + "=" + this.image.height); // announce resource height
//
//      /**
//       * Renders this sprite (using the correct animation step previously "rolled").
//       */
//      this.render = function() {
//          topctx.drawImage(this.image, this.srcX, this.srcY, this.dtx, this.dty,
//              this.x, this.y, this.width, this.height);
//        };
//      /**
//       * Special function to render the background image.
//       * @param xoffset
//       * @param yoffset
//       */
//      this.renderBackground = function(xoffset, yoffset) {
//          btmctx.drawImage(this.image, this.srcX + xoffset, this.srcY + yoffset,
//                                          this.dtx, this.dty,
//              this.x, this.y, this.width, this.height);
//      };
//  };
//};

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
            this.facing = "south";
            this.dialog = [];
            this.face = new Image();
            this.visualRadius = 50; // TODO: What is this?
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
    // TODO: OLD move code for reference only. New code is further down.
    /**
     *
     * @param clockTick
     */
    //this.move = function(clockTick) {
    //    console.log("(" + player.x + "," + player.y + ") [" + player.y/32 + "," + player.x/32 + "]");
    //    //console.log(player.x/32);
    //    //console.log(player.y);
    //    //console.log(player.y/32);
    //  var x = Math.floor(player.x/32) + 1;
    //  var y = Math.floor(player.y/32) + 1;
    //
    //
    //  if(87 in keys) { // W
    //      this.spriteRoll(512, 8, clockTick, 0.1);
    //      if (y > 0 && sign_screen_bounds[y - 1][x] === 0) {
    //        this.y -= this.speed;
    //      }
    //      this.facing = "north";
    //  }
    //
    //  if(83 in keys) { // S
    //      this.spriteRoll(640, 8,  clockTick, 0.1);
    //      if (y < 28 && sign_screen_bounds[y + 1][x] === 0) {
    //        this.y += this.speed;
    //      }
    //      this.facing = "south";
    //  }
    //
    //  if(65 in keys) { // A
    //      this.spriteRoll(576, 8,  clockTick, 0.1);
    //      if (x > 0 && sign_screen_bounds[y][x - 1] === 0) {
    //        this.x -= this.speed;
    //      }
    //      this.facing = "west";
    //  }
    //
    //  if(68 in keys) { // D
    //      this.spriteRoll(704, 8,  clockTick, 0.1);
    //      if (x < 18 && sign_screen_bounds[y][x + 1] === 0) {
    //        this.x += this.speed;
    //      }
    //      this.facing = "east";
    //  }
    //
    //
    //  if(32 in keys) { // Spacebar
    //    this.interact();
    //    console.log("space");
    //
    //      g.loadZone(2, 1, 8);
    //  }
    //};

    this.movePlayer = function(clockTick) {
        //console.log("(" + player.x + "," + player.y + ") [" + player.y/32 + "," + player.x/32 + "]");
        //console.log(player.x/32);
        //console.log(player.y);
        //console.log(player.y/32);
        //var oldx = this.x; // kirsten debug code
        //var oldy = this.y; // kirsten debug code
        var BOX_WIDTH = 29; // width of the player bounding box for collisions
        var BOX_HEIGHT = 24; // height of the player bounding box for collisions


        /** Collision detection needs to consider the whole square the character occupies. */
        var x_leftmost = Math.floor(player.x/32);
        var x_rightmost = Math.floor((player.x + BOX_WIDTH) / 32); // + 32 is player width but 31 is smoother
        var y_upmost = Math.floor(player.y/32);
        var y_downmost = Math.floor((player.y + BOX_HEIGHT) / 32); // + 32 is height of player's box (ignores head collisions)

        var y_new_grid = 0; // tracks if moving player will cause them to enter new grid
        var x_new_grid = 0; // tracks if moving player will cause them to enter new grid

        var exit; // tracks if the player's movement has triggered an exit and zone change

        /** Checks which keys are being currently pressed and moves player if new location is valid. */
        if(W_KEY in keys) { // W
            this.spriteRoll(512, 8, clockTick, 0.1); // even if player doesn't move, animate them!

            /** Determine if moving the player will result in entering a new grid location. */
            y_new_grid = 0;
            // if player would enter new grid and that grid isn't offscreen
            if (Math.floor((player.y - this.speed) / 32) !== y_upmost &&
                           (y_upmost - 1 >= 0)) {
                y_new_grid =  1;
            }

            /** If player would move off screen, move to edge instead, IF edge is a valid location */
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

        if(S_KEY in keys) { // S
            this.spriteRoll(640, 8,  clockTick, 0.1); // even if player doesn't move, animate them!

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

        if(A_KEY in keys) { // A
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

        if(D_KEY in keys) { // D
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

        /** Dylan/Duncan code. */
        if(this.facing === "north") {
            var space = this.y * 32 + 32
        } else if (this.facing === "south") {
            var space = this.y * 32 - 32
        } else if (this.facing === "west") {
            var space = this.x * 32 + 32
        } else {
            var space = this.x * 32 - 32
        }
            /*

              Kirsten's Interaction Code

            */
        // /** Kirsten testing queued actions for multiple text pop-ups.*/
        //   if (npc_Alden.talking === undefined) {
        //       npc_Alden.talking = true;   // test code forces Alden to start talking.
        //   }
        //   if (npc_Alden.talking === true) { // queues up some dialog since Alden is talking.
        //     //console.log(npc_Alden.face); // kirsten test code
        //         g.queuedActions.push(function (){window.uwetech.dialog.show(
        //           "I am testing the word wrap functionality of the dialog.show method. If everything " +
        //           "works out, then this should word wrap in a very nice way. This box displays, at most, " +
        //           "four lines of text, with words being wrapped after 75 characters.", npc_Alden.face);});
        //     // kirsten test code
        //
        //       g.queuedActions.push(function (){window.uwetech.dialog.showRight(
        //           "This dialog box is for showing how queuedActions could work with multiple dialog " +
        //           "boxes you want to display in a series. I am also showing the functionality of" +
        //           "aligning a portrait to the right instead of the left. Neat huh?", npc_Alden.face);});
        //     // Of course, always make sure you call a dialog.hide() when you are done showing text!!
        //       g.queuedActions.push(function () {window.uwetech.dialog.hide();});
        //     //console.log(g.queuedActions[0]);
        //       npc_Alden.talking = false;
        //   } else if (npc_Alden.talking === false) {
        //     // test code to start alden talking again if the queue will be empty after this cycle.
        //       if (g.queuedActions.length <= 1) {
        //           npc_Alden.talking = true; // make him talk on next spacebar press
        //       }
        //   }


        if(interactNPC === undefined) {

        /** Kirsten testing queued actions for multiple text pop-ups.*/
          if (npc_Alden.talking === undefined) {
              npc_Alden.talking = true;   // test code forces Alden to start talking.
          }
          if (npc_Alden.talking === true) { // queues up some dialog since Alden is talking.
            //console.log(npc_Alden.face); // kirsten test code
                g.queuedActions.push(function (){window.uwetech.dialog.show(
                  "You hear students in the distance having fun without you.", npc_Alden.face);});
            // kirsten test code

              g.queuedActions.push(function (){window.uwetech.dialog.showRight(
                  "Maybe you should go talk to them.", npc_Alden.face);});
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
            console.log(text);
            g.queuedActions.push((function (text) {
                   return function () {
                       window.uwetech.dialog.showRight(text, interactNPC.face);
                   };
                })(text));
          }
          g.queuedActions.push(function () {window.uwetech.dialog.hide();});
          npc_Alden.talking = false;
        } else if (npc_Alden.talking === false) {
          // test code to start alden talking again if the queue will be empty after this cycle.
            if (g.queuedActions.length <= 1) {
                npc_Alden.talking = true; // make him talk on next spacebar press
            }
        }
      }
        /** This logic will check if any actions are currently queued and pause the game.
         * Then the action at the front of the queue is called. If the action just called
         * results in the queue now being empty, the game is also un-paused. */
        if (g.queuedActions.length > 0 && g.queuedActions !== undefined) {
            g.isPaused = true;
            g.queuedActions.shift()();

            if (g.queuedActions.length === 0) {
                g.isPaused = false;
            }
        }


    };

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

    /**
     * TODO: No longer being used. Here for reference only.
     */
    //this.bounds = function() {
    //    var oldx = this.x;
    //    var oldy = this.y;
    //    this.x = m.clamp(this.x, 0 - this.width/2 + 20, 608 - 18 - this.width/2);
    //    this.y = m.clamp(this.y, 0 - this.height/2 + 20, 928 - 35 - this.height/2);
    //    if (Math.floor(oldx/32) !== Math.floor(this.x/32) ||
    //        Math.floor(oldy/32) !== Math.floor(this.y/32)) {
    //        console.log("(" + player.x + "," + player.y + ") [" +
    //                    player.y / 32 + "," + player.x / 32 + "]");
    //    }
    //};
};


/**
 * Kirsten's added this code for Background Object. This is really just to
 * render the background of a zone. I just didn't want it as part of the
 * Sprite code because it is so simple and doesn't really "do" stuff.
 *
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
        //this.renderGrid = function() {
        //
        //    topctx.clearRect(0, 0, topcanvas.width, topcanvas.height);
        //    topctx.beginPath();
        //
        //    for (var x = 0; x <= this.image.width; x += 32) {
        //        topctx.moveTo(0.5 + x, 0);
        //        topctx.lineTo(0.5 + x, this.image.height);
        //    }
        //
        //    for (var y = 0; y <= this.image.height; y += 32) {
        //        topctx.moveTo(0, 0.5 + y);
        //        topctx.lineTo(this.image.width, 0.5 + y);
        //    }
        //
        //    topctx.strokeStyle = "black";
        //    topctx.stroke();
        //
        //};
    };
};


var player = new Sprite();
var npc_Chin = new Sprite();
var npc_Alden = new Sprite();

var npc_Map1StairWalker = new Sprite();
var npc_Map1BottomWalker = new Sprite();
var npc_Map1Blocker = new Sprite();

var npc_Map2Cashier = new Sprite();
var npc_Map2Bookman = new Sprite();

var npc_Map3BottomWalker = new Sprite();
var npc_Map3dummyOne = new Sprite();
var npc_Map3dummyTwo = new Sprite();
var npc_Map3dummyThree = new Sprite();

var npc_Map4theChin = new Sprite();
var npc_Map4frontStudentOne = new Sprite();
var npc_Map4frontStudentTwo = new Sprite();
var npc_Map4middleStudentOne = new Sprite();
var npc_Map4middleStudentTwo = new Sprite();
var npc_Map4backStudentOne = new Sprite();

var npc_Map5dummyOne = new Sprite();
var npc_Map5dummyTwo = new Sprite();

var npc_Map6lib = new Sprite();

//var background = new Sprite();

// var alden_por = new Dialog();


// src, srcX, srcY, dtx, dty, x, y, width, height, speed

// NPC's
player.setOptions("./img/purple_orc.png", 0, 640, 64, 64,
                                    0, 0, 64, 64, 3);
//npc_Mobus.setOptions("./img/mobus.png", 0, 640, 64, 64, 350, 10, 62, 62, 1);

npc_Map1StairWalker.setOptions("./img/chin.png", 0, 140, 64, 64, 350,10, 62, 62, 1);
npc_Map1BottomWalker.setOptions("./img/alden.png", 0, 140, 64, 64, 300, 880, 62, 62, 2);
npc_Map1Blocker.setOptions("./img/alden.png", 0, 140, 64, 64, 530, 141, 62, 62, 2);


npc_Map2Cashier.setOptions("./img/chin.png", 0, 140, 64, 64, -15,155, 62, 62, 0);
npc_Map2Bookman.setOptions("./img/alden.png", 0, 140, 64, 64, 430, 40, 62, 62, 0);

npc_Map3BottomWalker.setOptions("./img/alden.png", 0, 140, 64, 64, 900, 600, 62, 62, 2);

npc_Map3dummyOne.setOptions("./img/alden.png", 0, 140, 64, 64, 800, 150, 62, 62, 2);
npc_Map3dummyTwo.setOptions("./img/alden.png", 0, 140, 64, 64, 750, 175, 62, 62, 2);
npc_Map3dummyThree.setOptions("./img/alden.png", 0, 140, 64, 64, 770, 135, 62, 62, 2);

npc_Map4theChin.setOptions("./img/chin.png", 0, 140, 64, 64, 515,20, 62, 62, 0);
npc_Map4frontStudentOne.setOptions("./img/chin.png", 0, 140, 64, 64, 440,20, 62, 62, 0);
npc_Map4frontStudentTwo.setOptions("./img/alden.png", 0, 140, 64, 64, 440,100, 62, 62, 0);
npc_Map4middleStudentOne.setOptions("./img/alden.png", 0, 140, 64, 64, 370,20, 62, 62, 0);
npc_Map4middleStudentTwo.setOptions("./img/chin.png", 0, 140, 64, 64, 370,100, 62, 62, 0);
npc_Map4backStudentOne.setOptions("./img/chin.png", 0, 140, 64, 64, 250,100, 62, 62, 0);

npc_Map5dummyOne.setOptions("./img/chin.png", 0, 140, 64, 64, 110,260, 62, 62, 0);
npc_Map5dummyTwo.setOptions("./img/alden.png", 0, 140, 64, 64, 20,20, 62, 62, 0);

npc_Map6lib.setOptions("./img/chin.png", 0, 140, 64, 64, 150,145, 62, 62, 0);


npc_Alden.face = (function () {
    var temp = new Image();
    temp.src =  "./img/Alden-plain.png";
    return temp;
})();
console.log(npc_Alden.face);

//Faces
// alden_por.setOptions("./img/Alden-plain.png", 0, 0, 480, 638, 100, 100, 480, 638);

/** Kirsten commented out
// Backgrounds
background.setOptions("./img/UWTmap1.jpg", 0, 0, btmcanvas.width, btmcanvas.height,
                                        0, 0, btmcanvas.width, btmcanvas.height, 0);
*/
var background = new BackgroundObject();
var initialBackground = new Image();
initialBackground.src = "./img/ext_stairs_lower.jpg";
background.set(initialBackground);

var grid = new BackgroundObject();
var gridimage = new Image();
gridimage.src = "./img/32x32grid.png";
grid.set(gridimage);

// npc_Mobus.image.onload = function() {
//   npc_Mobus.load = true;
// }

// var mobusCounter = 0;
// npc_Mobus.update = function(clockTick) {
//   if(mobusCounter === 0) {
//     this.spriteRoll(640, 8,  clockTick, 0.1);
//     this.y += this.speed;
//
//     if(this.y >= 700) {
//       mobusCounter = 1;
//     }
//
//   }
//   if(mobusCounter === 1) {
//     this.spriteRoll(512, 8, clockTick, 0.1);
//     this.y -= this.speed;
//
//     if(this.y <= 10) {
//       mobusCounter = 0;
//     }
//   }
//
// }

npc_Map1StairWalker.image.onload = function() {
  npc_Map1StairWalker.load = true;
  npc_Map1Blocker.load = true;
  npc_Map1BottomWalker.load = true;

  npc_Map2Cashier.load = true;
  npc_Map2Bookman.load = true;

  npc_Map3BottomWalker.load = true;
  npc_Map3dummyOne.load = true;
  npc_Map3dummyTwo.load = true;
  npc_Map3dummyThree.load = true;

  npc_Map4theChin.load = true;
  npc_Map4frontStudentOne.load = true;
  npc_Map4frontStudentTwo.load = true;
  npc_Map4middleStudentOne.load = true;
  npc_Map4middleStudentTwo.load = true;
  npc_Map4backStudentOne.load = true;

  npc_Map5dummyOne.load = true;
  npc_Map5dummyTwo.load = true;

  npc_Map6lib.load = true;

};

/*
Map1(bottomStaircase) Npc update functions are below
Blocker - If the player gets close he block you from going around.
Stairwalker - Walks up and down the stairs.. like a normal person.
BottomWalker - Walks left to right at the bottom of the stairs.. like a normal person.
*/
npc_Map1StairWalker.dialog[0] = "Hi there";
npc_Map1StairWalker.dialog[1] = "My Name is Jim";

npc_Map1BottomWalker.dialog[0] = "I am death";
npc_Map1BottomWalker.dialog[1] = "You can not escape me";
npc_Map1BottomWalker.face.src =  "./img/Robert.png";


npc_Map1Blocker.update = function(clockTick) {
  if(player.y < 171) {
    if(W_KEY in keys) {
      this.spriteRoll(512, 8,  clockTick, 0.1);
      this.y = (player.y - 30);
    }
    if(S_KEY in keys) {
      this.spriteRoll(640, 8,  clockTick, 0.1);
      this.y = (player.y - 30);
    }
  }
};

var chinFlip = 0;
var chinCounter = 0;
var chinDirection = 0;

npc_Map1StairWalker.update = function(clockTick) {
  //console.log(player.y);
  var dist = distance(this, player);
  var chinX = Math.floor(this.x/32) + 1;
  var chinY = Math.floor(this.y/32) + 1
  //Checks to see if you are next to chin
  if(dist <= 50 && chinCounter === 0) {
    chinDirection = chinFlip;
    chinFlip = 3;
    chinCounter = 1;
  }

  //If you are next to chin then this happens.
  if(chinFlip === 3) {
    this.y += 0;
    interactNPC = this;
    if(chinDirection === 0) {
      this.spriteRoll(640, 1,  clockTick, 0.5);
      sign_screen_bounds[chinY][chinX] = 1;
      sign_screen_bounds[chinY + 1][chinX] = 1;
      sign_screen_bounds[chinY][chinX + 1] = 1;
      sign_screen_bounds[chinY + 1][chinX + 1] = 1;
    }
    if(chinDirection === 1) {
      this.spriteRoll(512, 1, clockTick, 0.5);
      sign_screen_bounds[chinY][chinX] = 1;
      sign_screen_bounds[chinY + 1][chinX] = 1;
      sign_screen_bounds[chinY][chinX + 1] = 1;
      sign_screen_bounds[chinY + 1][chinX + 1] = 1;
    }
    if(dist >= 50) {
      sign_screen_bounds[chinY][chinX] = 0;
      sign_screen_bounds[chinY + 1][chinX] = 0;
      sign_screen_bounds[chinY][chinX + 1] = 0;
      sign_screen_bounds[chinY + 1][chinX + 1] = 0;
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
  var dist = distance(this, player);

  var aldenX = Math.floor(this.x/32) + 1;
  var aldenY = Math.floor(this.y/32) + 1

  //Checks to see if you are next to alden
  if(dist <= 50 && aldenCounter === 0) {
    aldenDirection = aldenFlip;
    aldenFlip = 3;
    aldenCounter = 1;
  }

  //If you are next to alden then this happens.
  if(aldenFlip === 3) {
    this.y += 0;
    interactNPC = this;
    if(aldenDirection === 0) {
      this.spriteRoll(704, 1,  clockTick, 0.5);
      sign_screen_bounds[aldenY][aldenX] = 1;
      sign_screen_bounds[aldenY + 1][aldenX] = 1;
      sign_screen_bounds[aldenY][aldenX + 1] = 1;
      sign_screen_bounds[aldenY + 1][aldenX + 1] = 1;
    }
    if(aldenDirection === 1) {
      this.spriteRoll(576, 1, clockTick, 0.5);
      sign_screen_bounds[aldenY][aldenX] = 1;
      sign_screen_bounds[aldenY + 1][aldenX] = 1;
      sign_screen_bounds[aldenY][aldenX + 1] = 1;
      sign_screen_bounds[aldenY + 1][aldenX + 1] = 1;
    }
    if(dist >= 50) {
      sign_screen_bounds[aldenY][aldenX] = 0;
      sign_screen_bounds[aldenY + 1][aldenX] = 0;
      sign_screen_bounds[aldenY][aldenX + 1] = 0;
      sign_screen_bounds[aldenY + 1][aldenX + 1] = 0;
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

npc_Map2Bookman.update = function(clockTick) {
  var dist = distance(this, player);
  //console.log(dist);
  if(dist <= 100) {
    this.spriteRoll(780, 5,  clockTick, 0.3);
  } else {
    this.spriteRoll(780, 1,  clockTick, 0.3);
  }

};
npc_Map2Cashier.update = function(clockTick) {
  var dist = distance(this, player);
  //console.log(dist);
  if(dist <= 100) {
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

npc_Map3dummyOne.update = function(clockTick) {
  this.spriteRoll(576, 1,  clockTick, 0.1);
}
npc_Map3dummyTwo.update = function(clockTick) {
  this.spriteRoll(512, 1,  clockTick, 0.1);
}
npc_Map3dummyThree.update = function(clockTick) {
  this.spriteRoll(900, 1,  clockTick, 0.1);
}

npc_Map3BottomWalker.update = function(clockTick) {
  var dist = distance(this, player);

  var aldenX = Math.floor(this.x/32) + 1;
  var aldenY = Math.floor(this.y/32) + 1

  //Checks to see if you are next to alden
  if(dist <= 50 && aldenCounter === 0) {
    aldenDirection = aldenFlip;
    aldenFlip = 3;
    aldenCounter = 1;
  }

  //If you are next to alden then this happens.
  if(aldenFlip === 3) {
    this.y += 0;
    if(aldenDirection === 0) {
      this.spriteRoll(704, 1,  clockTick, 0.5);
      sign_screen_bounds[aldenY][aldenX] = 1;
      sign_screen_bounds[aldenY + 1][aldenX] = 1;
      sign_screen_bounds[aldenY][aldenX + 1] = 1;
      sign_screen_bounds[aldenY + 1][aldenX + 1] = 1;
    }
    if(aldenDirection === 1) {
      this.spriteRoll(576, 1, clockTick, 0.5);
      sign_screen_bounds[aldenY][aldenX] = 1;
      sign_screen_bounds[aldenY + 1][aldenX] = 1;
      sign_screen_bounds[aldenY][aldenX + 1] = 1;
      sign_screen_bounds[aldenY + 1][aldenX + 1] = 1;
    }
    if(dist >= 50) {
      sign_screen_bounds[aldenY][aldenX] = 0;
      sign_screen_bounds[aldenY + 1][aldenX] = 0;
      sign_screen_bounds[aldenY][aldenX + 1] = 0;
      sign_screen_bounds[aldenY + 1][aldenX + 1] = 0;
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

npc_Map4theChin.update = function (clockTick) {

}
npc_Map4frontStudentOne.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}
npc_Map4frontStudentTwo.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}
npc_Map4middleStudentOne.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}
npc_Map4middleStudentTwo.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}
npc_Map4backStudentOne.update = function (clockTick) {
  this.spriteRoll(704, 1,  clockTick, 0.1);

}

npc_Map5dummyOne.update = function (clockTick) {
  this.spriteRoll(512, 1, clockTick, 0.1);
}
npc_Map5dummyTwo.update = function(clockTick) {

}

npc_Map6lib.update = function(clockTick) {
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
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
};

/**
 * TODO: Explain this object.
 * @constructor
 */

var interactNPC;

smallButton = new Image();
var Game = function() {
    //Creating an array of arrays for the entites
    this.entiteZones = [];
    this.debug = false;
    console.log("DEBUG IS OFF. Hit the Tilde (~ `) key to turn it on!");
    /** Tracks if game is currently in a paused state. */
    this.isPaused = false;
    /** Array of queued actions. Sets isPaused to true when queuedActions length is > 0. */
    this.queuedActions = [];

    /*
    I made it so that at each index it would hold the entities
    for the appropriate zone
    */
    this.entiteZones[1] = this.zoneOneEntites = [];
    this.entiteZones[2] = this.zoneTwoEntites = [];
    this.entiteZones[3] = this.zoneThreeEntites = [];
    this.entiteZones[4] = this.zoneFourEntites = [];
    this.entiteZones[5] = this.zoneFiveEntites = [];
    this.entiteZones[6] = this.zoneSixEntites = [];
    // Game or zone wide entities?
    this.currentZone;

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
    this.handleKeyDown = function (key_id) {

        // 87, 83, 65, 68, 32
        if (key_id === SPACE_KEY) { // Spacebar
            player.interact(interactNPC);
            console.log("space");
            //g.loadZone(2, 1, 8); // kirsten debug, tested zone loading via button press
        } else if (key_id === W_KEY) {
            player.facing = "north";
        } else if (key_id === A_KEY) {
            player.facing = "west";
        } else if (key_id === S_KEY) {
            player.facing = "south";
        } else if (key_id === D_KEY) {
            player.facing = "east";
        } else if (key_id === DEBUG_KEY) {
            if (g.debug === true) {
                g.debug = false;
                console.log("DEBUG OFF");
            } else {
                g.debug = true;
                console.log("DEBUG ON");
            }
        } else {
            // do nothing
        }

    };

    /**
     * Triggers when the window "hears" a key up event.
     * @param key_id
     */
    this.handleKeyUp = function (key_id) {
        // did we want to track when a key is released??
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
        if (g.isPaused === false) {
            this.update(this.timer.tick());
            this.render();
        }
        requestAnimFrame(this.loop.bind(this));
    };

    /**
     * TODO: Describe this function.
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

    /**
     * TODO: Describe this function.
     * @param clockTick
     */
    this.update = function(clockTick) {
      this.cam.getPosition(player);
      interactNPC = undefined;
      //player.bounds();
      player.movePlayer(clockTick);

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
     * TODO: Describe this function.
     */
    this.render = function() {
      topctx.clearRect(0, 0, topcanvas.width, topcanvas.height);
      if(interactNPC === undefined) {
        smallButton.src = './img/doButtonInactive.png';
        topctx.drawImage(smallButton, 0, 0, smallButton.width, smallButton.height,
            0, 0, smallButton.width, smallButton.height);
      }
      if(interactNPC !== undefined) {
        smallButton.src = './img/doButtonActive.png';
        topctx.drawImage(smallButton, 0, 0, smallButton.width, smallButton.height,
            0, 0, smallButton.width, smallButton.height);
      }

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

        /**
         * NOTE: Anything that can change state needs to be reset after a game over.
         * If you notice anything missing from this list, add it! */


        /** 1) Timer needs to be reset. */
        // TODO: Can someone show me how to reset the timer?

        /** 2) Reset the win conditions back to none. */
        // TODO: First we need to add variables that track which win conditions are done.

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

        /** 10) Un-pause the game. */  // TODO: Not sure if we need this or not.
        g.isPaused = false;

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

g.addEntityZoneTwo(npc_Map2Bookman);
g.addEntityZoneTwo(npc_Map2Cashier);

g.addEntityZoneThree(npc_Map3BottomWalker);
g.addEntityZoneThree(npc_Map3dummyOne);
g.addEntityZoneThree(npc_Map3dummyTwo);
g.addEntityZoneThree(npc_Map3dummyThree);

g.addEntityZoneFour(npc_Map4theChin);
g.addEntityZoneFour(npc_Map4frontStudentOne);
g.addEntityZoneFour(npc_Map4frontStudentTwo);
g.addEntityZoneFour(npc_Map4middleStudentOne);
g.addEntityZoneFour(npc_Map4middleStudentTwo);
g.addEntityZoneFour(npc_Map4backStudentOne);

g.addEntityZoneFive(npc_Map5dummyOne);
g.addEntityZoneFive(npc_Map5dummyTwo);

g.addEntityZoneSix(npc_Map6lib);



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
