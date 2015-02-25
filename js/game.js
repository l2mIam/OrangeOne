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
var dialogs = [];

var keys = window.uwetech.Input.keys;

// Assign the bottom canvas variables
var btmcanvas = document.getElementById('bottomlayer'),
    btmctx = btmcanvas.getContext('2d');

// Assign the middle canvas variables
var midcanvas = document.getElementById('middlelayer'),
    midctx = midcanvas.getContext('2d');

// Assign the top canvas variables
var topcanvas = document.getElementById('toplayer'),
    topctx = topcanvas.getContext('2d');

// zone #1's off limit areas
var sign_screen_bounds = [[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                          [1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
                          [0,0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0],
                          [0,1,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
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

var Dialog = function() {
  this.load = false;
  this.imgX = 0;


  this.setOptions = function(src, srcX, srcY, dtx, dty, x, y, width, height) {
          this.srcX = srcX;
          this.srcY = srcY;
          this.dtx = dtx;
          this.dty = dty;
          this.x = x;
          this.y = y;
          this.width = width;
          this.height = height;
          this.draw = false;

          this.image = new Image();
          this.image.src = src;
          //console.log(" " + src + "=" + this.image.height); // announce resource height

      /**
       * Renders this sprite (using the correct animation step previously "rolled").
       */
      this.render = function() {
          topctx.drawImage(this.image, this.srcX, this.srcY, this.dtx, this.dty,
              this.x, this.y, this.width, this.height);
        };
      /**
       * Special function to render the background image.
       * @param xoffset
       * @param yoffset
       */
      this.renderBackground = function(xoffset, yoffset) {
          btmctx.drawImage(that.image, this.srcX + xoffset, this.srcY + yoffset,
                                          this.dtx, this.dty,
              this.x, this.y, this.width, this.height);
      };
  };


}

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
            this.facing = "south";
            this.visualRadius = 50;

            this.elapsedTime = 0;
            this.image = new Image();
            this.image.src = src;
            //console.log(" " + src + "=" + this.image.height); // announce resource height

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

    this.move = function(clockTick) {
      var x = Math.floor(player.x/32) + 1;
      var y = Math.floor(player.y/32) + 1;


      if(87 in keys) { // W
          this.spriteRoll(512, 8, clockTick, 0.1);
          if (y > 0 && sign_screen_bounds[y - 1][x] === 0) {
            this.y -= this.speed;
          }
          this.facing = "north";
      }

      if(83 in keys) { // S
          this.spriteRoll(640, 8,  clockTick, 0.1);
          if (y < 28 && sign_screen_bounds[y + 1][x] === 0) {
            this.y += this.speed;
          }
          this.facing = "south";
      }

      if(65 in keys) { // A
          this.spriteRoll(576, 8,  clockTick, 0.1);
          if (x > 0 && sign_screen_bounds[y][x - 1] === 0) {
            this.x -= this.speed;
          }
          this.facing = "west";
      }

      if(68 in keys) { // D
          this.spriteRoll(704, 8,  clockTick, 0.1);
          if (x < 18 && sign_screen_bounds[y][x + 1] === 0) {
            this.x += this.speed;
          }
          this.facing = "east";
      }

      if(32 in keys) { // Spacebar
        this.interact();
        console.log("space");
      }
    };

    this.interact = function() {
      if(this.facing === "north") {
        var space = this.y * 32 + 32
      } else if (this.facing === "south") {
        var space = this.y * 32 - 32
      } else if (this.facing === "west") {
        var space = this.x * 32 + 32
      } else {
        var space = this.x * 32 - 32
      }
      if(dialogs[0].draw) {
        dialogs[0].draw = false;
          window.uwetech.dialog.hide(); // kirsten test code
          topctx.clearRect(0, 0, topcanvas.width, topcanvas.height);
      } else {
        dialogs[0].draw = true;
          console.log(alden_por.image);
          window.uwetech.dialog.show(
              "I am testing the length requirements for this section of all of the awesome " +
              "stuff we are doing it is quite amazing yes?!",
              "foobar!", alden_por.image); // kirsten test code
      }
    }

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
    }

    this.update = function() {
    };

    this.bounds = function() {
    this.x = m.clamp(this.x, 0 - this.width/2 + 20, 608 - 18 - this.width/2);
    this.y = m.clamp(this.y, 0 - this.height/2 + 20, 928 - 35 - this.height/2);
    };
};

var player = new Sprite();
var npc_Chin = new Sprite();
var npc_Alden = new Sprite();
var background = new Sprite();

var alden_por = new Dialog();


// src, srcX, srcY, dtx, dty, x, y, width, height, speed

// NPC's
player.setOptions("./img/purple_orc.png", 0, 640, 64, 64,
                                    300, 300, 62, 62, 3);
//npc_Mobus.setOptions("./img/mobus.png", 0, 640, 64, 64, 350, 10, 62, 62, 1);
npc_Chin.setOptions("./img/chin.png", 0, 140, 64, 64, 350,10, 62, 62, 1);
npc_Alden.setOptions("./img/alden.png", 0, 140, 64, 64, 300, 850, 62, 62, 2);


//Faces
alden_por.setOptions("./img/Alden-plain.png", 0, 0, 480, 638, 100, 100, 480, 638);


// Backgrounds
background.setOptions("./img/UWTmap1.png", 0, 0, btmcanvas.width, btmcanvas.height,
                                        0, 0, btmcanvas.width, btmcanvas.height, 0);

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

npc_Chin.image.onload = function() {
  npc_Chin.load = true;
}

var chinFlip = 0; // Flips between north and south.
var chinCounter = 0; // Checks to see if you have incountered him.
var chinDirection = 0;
npc_Chin.update = function(clockTick) {
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
}

npc_Alden.image.onload = function() {
  npc_Alden.load = true;
}

var aldenFlip = 0;
var aldenCounter = 0;
var aldenDirection = 0;
npc_Alden.update = function(clockTick) {
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

    if(this.x >= 500) {
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
}

player.image.onload = function() {
  player.load = true;
  alden_por.load = true;
  dialogs.push(alden_por);
};

background.image.onload = function() {
  background.load = true;
};

//var sign_screen_bounds = window.uwetech.zones[1].bounds;

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
}

var Game = function() {
    this.entities = [];

    this.start = function() {
      this.cam  = new Camera();
      this.cam.setup(player);
      this.timer = new Timer();
      this.loop();
    };

    this.loop = function() {
        this.update(this.timer.tick());
        this.render();
        requestAnimFrame(this.loop.bind(this));
    };


    this.addEntity = function (entity) {

        this.entities.push(entity);
    }

    this.update = function(clockTick) {
      this.cam.getPosition(player);
      player.bounds();
      player.move(clockTick);

      var entitiesCount = this.entities.length;
      for (var i = 0; i < entitiesCount; i++) {
          var entity = this.entities[i];

          entity.update(clockTick);
      }

    };

    this.render = function() {
        midctx.clearRect(0, 0, midcanvas.width, midcanvas.height);
        midctx.save();
        midctx.translate(this.cam.x, this.cam.y);
        var entitiesCount = this.entities.length;

        for (var i = 0; i < entitiesCount; i++) {
            var entity = this.entities[i];
            if(entity.load) {
              entity.render();
            }
        }
        if (background.load) {
            //btmctx.clearRect(0, 0, btmcanvas.width, btmcanvas.height);
            background.renderBackground(this.cam.x * - 1, this.cam.y * - 1);
        }
        if (player.load) {
            player.render();
        }

        if(alden_por.draw) {
          alden_por.render();
        }

        midctx.restore();
    };
};



var g = new Game();
var m = new math();
g.start();
g.addEntity(npc_Chin);
//g.addEntity(npc_Mobus);
g.addEntity(npc_Alden);
