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
            this.visualRadius = 50; // TODO: What is this?

            this.x_hook = 0;
            this.y_hook = 0;

            this.elapsedTime = 0; // TODO: What is this? How does it relate to sprite?
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
        var BOX_WIDTH = 30; // width of the player bounding box for collisions
        var BOX_HEIGHT = 26; // height of the player bounding box for collisions


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
                    this.y = 0;
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
                          ((y_downmost + 1) <= sign_screen_bounds.length - 1)) {
                y_new_grid = 1;
            }

            /** If player would move off screen, move to edge instead, IF edge is a valid location */
            if ((player.y + BOX_HEIGHT + this.speed) < background.image.height) { // "+32" player height no head
                /** Check that the player can move based on left AND right bounding box */
                if (sign_screen_bounds[y_downmost + y_new_grid][x_leftmost] === 0 &&
                    sign_screen_bounds[y_downmost + y_new_grid][x_rightmost] === 0) {
                    this.y += this.speed;
                }
            } else { /** player is trying to move off screen, align them to edge if valid location. */
                if (sign_screen_bounds[sign_screen_bounds.length - 1][x_leftmost] === 0 &&
                    sign_screen_bounds[sign_screen_bounds.length - 1][x_rightmost] === 0) {
                    this.y = background.image.height - BOX_HEIGHT; // "-32" is height of player minus head
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
            if ((player.x + BOX_WIDTH + this.speed) < background.image.width) { // "+32" is width of player
                /** Check that the player can move based on top AND bottom bounding box */
                if (sign_screen_bounds[y_upmost][x_rightmost + x_new_grid] === 0 &&
                    sign_screen_bounds[y_downmost][x_rightmost + x_new_grid] === 0) {
                    this.x += this.speed;
                }
            } else { /** player is trying to move off screen, align them to edge if valid location. */
                if (sign_screen_bounds[y_upmost][sign_screen_bounds[y_upmost].length - 1] === 0 &&
                    sign_screen_bounds[y_downmost][sign_screen_bounds[y_upmost].length - 1] === 0) {
                    this.x = background.image.width - 32; // "-32" is width of player
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

    this.interact = function() {

        /** Kirsten testing queued actions for multiple text pop-ups.*/
        if (npc_Alden.talking === undefined) {
            npc_Alden.talking = true;
        }
        if (npc_Alden.talking === true) {
            //console.log(npc_Alden.face); // kirsten test code
            g.queuedActions.push(function (){window.uwetech.dialog.show(
                "I am testing the length requirements for this section of all of the awesome " +
                "stuff we are doing it is quite amazing yes?!", npc_Alden.face);}); // kirsten test code

            g.queuedActions.push(function (){window.uwetech.dialog.show(
                "I'm a little teappot, short and stout. Here is my handle and here is my stout." +
                " When I get all steamed up, here me shout! Tip me over and pour me out. This is a " +
                "test of the second dialog while talking to same npc trick. Yay for queues!!!", npc_Alden.face);});
            g.queuedActions.push(function () {window.uwetech.dialog.hide();}); // kirsten test code
            //console.log(g.queuedActions[0]);
            npc_Alden.talking = false;
        } else if (npc_Alden.talking === false) {
            // topctx.clearRect(0, 0, topcanvas.width, topcanvas.height);
            if (g.queuedActions.length <= 1) {
                npc_Alden.talking = true; // make him talk on next spacebar press
            }
        }
        // somehow kirsten deleted the above code. OOPS.

        if(this.facing === "north") {
            var space = this.y * 32 + 32
        } else if (this.facing === "south") {
            var space = this.y * 32 - 32
        } else if (this.facing === "west") {
            var space = this.x * 32 + 32
        } else {
            var space = this.x * 32 - 32
        }

        if (g.queuedActions.length > 0) {
            g.isPaused = true;
            g.queuedActions.shift()();

            if (g.queuedActions.length === 0) {
                g.isPaused = false;
            }
            //action();
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
//var background = new Sprite();

// var alden_por = new Dialog();


// src, srcX, srcY, dtx, dty, x, y, width, height, speed

// NPC's
player.setOptions("./img/purple_orc.png", 0, 640, 64, 64,
                                    0, 0, 64, 64, 3);
//npc_Mobus.setOptions("./img/mobus.png", 0, 640, 64, 64, 350, 10, 62, 62, 1);

npc_Map1StairWalker.setOptions("./img/chin.png", 0, 140, 64, 64, 350,10, 62, 62, 1);
npc_Map1BottomWalker.setOptions("./img/alden.png", 0, 140, 64, 64, 300, 880, 62, 62, 2);
npc_Map1Blocker.setOptions("./img/alden.png", 0, 140, 64, 64, 530, 10, 62, 62, 2);


npc_Map2Cashier.setOptions("./img/chin.png", 0, 140, 64, 64, -15,155, 62, 62, 0);
npc_Map2Bookman.setOptions("./img/alden.png", 0, 140, 64, 64, 430, 40, 62, 62, 0);

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
};

/*
Map1(bottomStaircase) Npc update functions are below
Blocker - If the player gets close he block you from going around.
Stairwalker - Walks up and down the stairs.. like a normal person.
BottomWalker - Walks left to right at the bottom of the stairs.. like a normal person.
*/

npc_Map1Blocker.update = function(clockTick) {
  if(player.y < 40) {
    if(W_KEY in keys) {
      this.spriteRoll(512, 8,  clockTick, 0.1);
      this.y = (player.y - 30);
    }
    if(S_KEY in keys) {
      this.spriteRoll(640, 8,  clockTick, 0.1);
      this.y = (player.y - 30);
    }
  }


}

var chinFlip = 0;
var chinCounter = 0;
var chinDirection = 0;

npc_Map1StairWalker.update = function(clockTick) {
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

/** When player's spritesheet loads in browser, sets player.load to true. */
player.image.onload = function() {
  player.load = true;
    //console.log(player.dty);
    player.y_hook = player.dty / 2 + 4;
    player.x_hook = (player.dtx / 4 ) ;
//  alden_por.load = true; // TODO: Why is Alden in here?
 // dialogs.push(alden_por);
};

/** When background's spritesheet loads in browser, sets background.load to true. */
background.image.onload = function() {
  background.load = true;
};
grid.image.onload = function() {
    grid.load = true;
};

//var sign_screen_bounds = window.uwetech.zones[1].bounds;

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
var Game = function() {
    //Creating an array of arrays for the entites
    this.entiteZones = [];
    this.debug = true;
    console.log("DEBUG IS ON. Hit the Tilde (~ `) key to turn it off!");
    this.isPaused = false;
    this.queuedActions = [];
        //function (){window.uwetech.dialog.show(
        //"I am testing the length requirements for this section of all of the awesome " +
        //"stuff we are doing it is quite amazing yes?!", npc_Alden.face);}, // kirsten test code
        //function () {window.uwetech.dialog.hide();}]; // kirsten test code

    /*
    I made it so that at each index it would hold the entities
    for the appropriate zone
    */
    this.entiteZones[1] = this.zoneOneEntites = [];
    this.entiteZones[2] = this.zoneTwoEntites = [];
    this.entiteZones[3] = this.zoneThreeEntites = [];  // Game or zone wide entities?
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
                loadctx.fillStyle = "#000000";
                loadctx.fillRect(0, 0, topcanvas.width, topcanvas.height);
                loadctx.font = "25px sans-serif";
                loadctx.fillStyle = "#ffffff";
                loadctx.fillText("Loading...", loadcanvas.width / 1.5,
                                               loadcanvas.height - (loadcanvas.height / 5));
                setTimeout(function () {
                    loadctx.clearRect(0, 0, loadcanvas.width, loadcanvas.height);
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
            player.interact();
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
      this.loadZone(1, 10, 23);
      this.loop();
    };

    /**
     * TODO: Describe this function.
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
    this.addEntityThreeTwo = function (entity) {
        this.zoneThreeEntites.push(entity);
    };

    /**
     * TODO: Describe this function.
     * @param clockTick
     */
    this.update = function(clockTick) {
      this.cam.getPosition(player);
      //player.bounds();
      player.movePlayer(clockTick);

      /*
      Get the current zone you are in and draw the entites
      */

        if (this.entiteZones.length >= this.currentZone.id) { // kirsten adding in catches
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
                midctx.strokeRect(player.x, player.y, 30, 26);
            }
        }


      //  if(alden_por.draw) {
      //    alden_por.render();
      //  }

        midctx.restore();
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
