// shim layer with setTimeout fallback
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000/60);
          };
})()

// Setup the canvas
var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

canvas.width = 640;
canvas.height = 352;
canvas.backgroundColor = "black";

document.body.appendChild(canvas);

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
                          [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
                          [0,1,1,1,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0],
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

// Movement stuff

var keys = {};

window.addEventListener('keydown', function(e) {
    keys[e.keyCode] = true;

});
window.addEventListener('keyup', function(e) {
    delete keys[e.keyCode];
});


// Keeps the player in bounds
var math = function() {
  this.clamp = function(i, min, max) {
    return Math.max(Math.min(i, max),min);
  }
}

var Camera = function() {
  this.camera = function(entity) {
    this.x = (canvas.width / 2) - entity.x;
    this.y = (canvas.height / 2) - entity.y;
  }

  this.getPosition = function(entity) {
    this.x = (canvas.width / 2) - entity.x;
    this.y = (canvas.height / 2) - entity.y;
  }
}

var ent = function() {
    this.load = false;
    this.imgX = 0;

    this.sprite = function(src, srcX, srcY, dtx, dty, x, y, width, height, speed) {
            this.src = src;
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

    this.render = function() {
        ctx.drawImage(this.image, this.srcX, this.srcY, this.dtx, this.dty, this.x, this.y, this.width, this.height);
      }

    }

    this.update = function() {
    }

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
    }

    this.spriteRoll = function(srY, maxLength) {
        this.srcY = srY;
        this.imgX += 1;

        this.srcX = this.dtx * this.imgX;

        if (this.imgX >= maxLength) {
            this.imgX = 0;
        }
    }

    this.bounds = function() {
    this.x = m.clamp(this.x, 0 - this.width/2 + 20, 608 - 18 - this.width/2);
    this.y = m.clamp(this.y, 0 - this.height/2 + 20, 928 - 35 - this.height/2);
  }
}

var player = new ent();
              // src, srcX, srcY, dtx, dty, x, y, width, height, speed
player.sprite("http://opengameart.org/sites/default/files/red_orc.png", 0, 640, 64, 64, 300, 300, 62, 62, 5);

var background = new ent();
background.sprite("./UWTmap1.png", 0, 0, 608, 928, 0, 0, 608, 928, 0);

player.image.onload = function() {
  player.load = true;
}

background.image.onload = function() {
  background.load = true;
}

var tiles = function() {
  // Width and height of each tile
  this.TILE_WIDTH = 32;
  this.TILE_HEIGHT = 32;

  this.x = 0;
  this.y = 0;
  this.width = 60;
  this.height = 60;

  var rc = Math.floor((Math.random() * 200) + 0);
  var gc = Math.floor((Math.random() * 200) + 0);
  var bc = Math.floor((Math.random() * 200) + 0);
  var ac = 1;

  // Draw the tile to the position (sx, sy)
  this.draw = function() {
    this.sx = 0;
    this.sy = 0;
    this.sx = this.x * this.TILE_WIDTH;
    this.sy = this.y * this.TILE_HEIGHT;

    ctx.fillStyle = "rgba(" + rc + ", " + gc + ", " + bc + ", " + ac + ")";
    ctx.fillRect(this.sx, this.sy, this.width, this.height);
  }
}

var Map = function() {
  // Rows (x), colums Y
  this.ROWS = 1000;
  this.COLS = 1000;

  this.tiles = this.ROWS * this.COLS;
  this.tilesArray = [];

  this.map = function() {
    // Creates 1000 Colums
    for (var y = 0; y < this.COLS; y++) {
      // Creates 1000 rows
      for (var x = 0; x < this.ROWS; x++) {
        // tilesArray[current tile position] = generate tile
        this.tilesArray[y*this.COLS + x] = new tiles();
        // Give it the x and y coords or the loops
        this.tilesArray[y*this.COLS + x].x = x;
        this.tilesArray[y*this.COLS + x].y = y;
      }
    }
  }

  this.tiles = function(cam, tWidth, tHeight) {
    for (var y = 0; y < this.COLS; y++) {
      for (var x = 0; x < this.ROWS; x++) {
        // Draw the map within the camera bounds
        if (
					this.tilesArray[y*this.COLS + x].x * tWidth < -cam.x + canvas.width &&
					this.tilesArray[y*this.COLS + x].y * tHeight < -cam.y + canvas.width &&
					(this.tilesArray[y*this.COLS + x].x + 1) * tWidth > -cam.x &&
					(this.tilesArray[y*this.COLS + x].y + 1) * tHeight > -cam.y
				   )
				{
            // draw tile
					//this.tilesArray[y*this.COLS + x].draw();
				}
      }
    }
  }
}

var game = function() {
    this.m = new Map();
    this.t = new tiles();
    this.cam  = new Camera();

    this.start = function() {
      this.m.map();
      this.cam.camera(player);
      this.loop();
    }

    this.loop = function() {
        this.update();
        this.render();
        requestAnimFrame(this.loop.bind(this));
    }

    this.update = function() {
      this.cam.getPosition(player);
      player.bounds();
      player.move();
      console.log(Math.floor((player.x/32) + 1) + " " + Math.floor((player.y/32) + 1));
    }

    this.render = function() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);

     ctx.save();

     ctx.translate(this.cam.x, this.cam.y);
     this.m.tiles(this.cam, this.t.TILE_WIDTH, this.t.TILE_HEIGHT);
      if (background.load) {
        background.render();
      }
      if (player.load) {
        player.render();
      }

     ctx.restore();
    }
}

var g = new game();
var m = new math();
g.start();
