// Relate animation drawing to window frame rate
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame  ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
          function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

//// Assign the main canvas variables
//var canvas = document.getElementById('mainCanvas'),
//    ctx = canvas.getContext('2d');

var keys = window.uwetech.Input.keys;

// Assign the bottom canvas variables
var btmcanvas = document.getElementById('bottomlayer'),
    btmctx = btmcanvas.getContext('2d');

// Assign the middle canvas variables
var midcanvas = document.getElementById('middlelayer'),
    midctx = midcanvas.getContext('2d');

// zone #1's off limit areas
var sign_screen_bounds = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                          [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,0,0],
                          [0,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0],
                          [0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1,0],
                          [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                          [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                          [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
                          [1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
                          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];

// Keeps the player in bounds
var math = function() {
  this.clamp = function(i, min, max) {
    return Math.max(Math.min(i, max),min);
  };
};

/**
 *  The camera will control what part of a map we're viewing and where
 *  the entities will be drawn on screen relative to current camera view
 * @constructor
 */
var Camera = function() {
    /**
     * Recalculate camera position based entirely on the passed
     * entity's x and y location. (entity should be player!!)
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
    this.imgX = 0;

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

            this.image = new Image();
            this.image.src = src;
            console.log(" " + src + "=" + this.image.height); // announce resource height

        /**
         * Renders this sprite (using the correct animation step previously "rolled").
         */
        this.render = function() {
            midctx.drawImage(this.image, this.srcX, this.srcY, this.dtx, this.dty,
                this.x, this.y, this.width, this.height);
          };
        /**
         * Special function to render the background image.
         * @param xoffset
         * @param yoffset
         */
        this.renderBackground = function(xoffset, yoffset) {
            btmctx.drawImage(this.image, this.srcX + xoffset, this.srcY + yoffset,
                                            this.dtx, this.dty,
                this.x, this.y, this.width, this.height);
        };
    };

    this.move = function() {
      var x = Math.floor(player.x/32) + 1;
      var y = Math.floor(player.y/32) + 1;


      if(87 in keys) { // W
          this.spriteRoll(512, 8);
          if (y > 0 && sign_screen_bounds[y - 1][x] === 0) {
            this.y -= this.speed;
          }
      }

      if(83 in keys) { // S
          this.spriteRoll(640, 8);
          if (y < 28 && sign_screen_bounds[y + 1][x] === 0) {
            this.y += this.speed;
          }
      }

      if(65 in keys) { // A
          this.spriteRoll(576, 8);
          if (x > 0 && sign_screen_bounds[y][x - 1] === 0) {
            this.x -= this.speed;
          }
      }

      if(68 in keys) { // D
          this.spriteRoll(704, 8);
          if (x < 18 && sign_screen_bounds[y][x + 1] === 0) {
            this.x += this.speed;
          }
      }
    };

    this.spriteRoll = function(srY, maxLength) {
        this.srcY = srY;
        this.imgX += 1;

        this.srcX = this.dtx * this.imgX;

        if (this.imgX >= maxLength) {
            this.imgX = 0;
        }
    };

    this.update = function() {
    };

    this.bounds = function() {
    this.x = m.clamp(this.x, 0 - this.width/2 + 20, 608 - 18 - this.width/2);
    this.y = m.clamp(this.y, 0 - this.height/2 + 20, 928 - 35 - this.height/2);
    };
};

var player = new Sprite();
              // src, srcX, srcY, dtx, dty, x, y, width, height, speed
player.setOptions("./img/purple_orc.png", 0, 640, 64, 64,
                                    300, 300, 62, 62, 5);

var background = new Sprite();
background.setOptions("./img/UWTmap1.png", 0, 0, btmcanvas.width, btmcanvas.height,
                                        0, 0, btmcanvas.width, btmcanvas.height, 0);

player.image.onload = function() {
    console.log("player.image.width=" + player.image.width);
  player.load = true;
};

background.image.onload = function() {
  background.load = true;
};


var Game = function() {
    this.cam  = new Camera();

    this.start = function() {
      this.cam.setup(player);
      this.loop();
    };

    this.loop = function() {
        this.update();
        this.render();
        requestAnimFrame(this.loop.bind(this));
    };

    this.update = function() {
      this.cam.getPosition(player);
      player.bounds();
      player.move();
      //console.log(Math.floor((player.x/32) + 1) + " " + Math.floor((player.y/32) + 1));
    };

    this.render = function() {
        midctx.clearRect(0, 0, midcanvas.width, midcanvas.height);
        midctx.save();
        midctx.translate(this.cam.x, this.cam.y);
        if (background.load) {
            //btmctx.clearRect(0, 0, btmcanvas.width, btmcanvas.height);
            background.renderBackground(this.cam.x * - 1, this.cam.y * - 1);
        }
        if (player.load) {
            player.render();
        }
        midctx.restore();
    };
};



var g = new Game();
var m = new math();
g.start();
