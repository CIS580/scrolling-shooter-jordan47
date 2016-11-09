"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Vector = require('./vector');
const Camera = require('./camera');
const Player = require('./player');
const BulletPool = require('./bullet_pool');
const Tilemap = require('./tilemap.js');
const Enemies = require('./enemies.js');
const Powerup = require('./powerup.js')


/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var frame = 0;
var spawntimer = 5 * Math.random();
var groundLv1 = require('../assets/groundLv1.json');
var groundLv2 = require('../assets/groundLv2.json');
var midLv1 = require('../assets/midLv1.json');
var midLv2 = require('../assets/midLv2.json');
var midLv3 = require('../assets/midLv3.json');
var highLv1 = require('../assets/highLv1.json');
var highLv2 = require('../assets/highLv2.json');
var highLv3 = require('../assets/highLv3.json');
var powerupArr = [];
var powerup1 = new Powerup(3000);
var powerup2 = new Powerup(1500);
var powerup3 = new Powerup(700);
powerup1.img = new Image();
powerup1.img.src = encodeURI('assets/powerup1.png');
powerup2.img = new Image();
powerup2.img.src = encodeURI('assets/powerup2.png');
powerup3.img = new Image();
powerup3.img.src = encodeURI('assets/powerup3.png');
powerupArr.push(powerup1);
powerupArr.push(powerup2);
powerupArr.push(powerup3);
var tilemaps = [];

tilemaps.push(new Tilemap(groundLv1, {
    onload: function() {
      checkIfLoaded();
    }
}));

tilemaps.push(new Tilemap(midLv1, {
    onload: function() {
      checkIfLoaded();
    }
}));

tilemaps.push(new Tilemap(highLv1, {
    onload: function() {
      checkIfLoaded();
    }
}));

tilemaps.push(new Tilemap(groundLv2, {
    onload: function() {
      checkIfLoaded();
    }
}));

tilemaps.push(new Tilemap(midLv2, {
    onload: function() {
      checkIfLoaded();
    }
}));

tilemaps.push(new Tilemap(highLv2, {
    onload: function() {
      checkIfLoaded();
    }
}));

tilemaps.push(new Tilemap(midLv3, {
    onload: function() {
      checkIfLoaded();
    }
}));

tilemaps.push(new Tilemap(highLv3, {
    onload: function() {
      checkIfLoaded();
    }
}));

var numLayers = 8;
function checkIfLoaded()
{
  numLayers--;
  if(numLayers == 0) masterLoop(performance.now());
}

var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var camera = new Camera(canvas);
var bullets = new BulletPool(10);
var missiles = [];
var player = new Player(bullets, missiles);
var enemies = new Enemies(player);

/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
      event.preventDefault();
      break;
    case "m":
      input.firing = true;
      event.preventDefault();
      break;
  }

}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
      event.preventDefault();
      break;
    case "m":
      input.firing = false;
      event.preventDefault();
      break;
    }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
  /*powerupArr.forEach(function(powerup)
  {
    checkPowerupCollisions(player, powerup);
  });*/
  //update the enemies
  enemies.update(player);

  // update the player
  player.update(elapsedTime, input);
  console.log(player.position.y);

  // update the camera
  camera.update(player.position);

  // Update bullets
  bullets.update(elapsedTime, function(bullet){
    if(!camera.onScreen(bullet)) return true;
    return false;
  });

  // Update missiles
  var markedForRemoval = [];
  missiles.forEach(function(missile, i){
    missile.update(elapsedTime);
    if(Math.abs(missile.position.x - camera.x) > camera.width * 2)
      markedForRemoval.unshift(i);
  });
  // Remove missiles that have gone off-screen
  markedForRemoval.forEach(function(index){
    missiles.splice(index, 1);
  });
}

/*function checkPowerupCollisions(player, powerup)
{
  player.position.x < powerup.x + 24 &&
   player.position.x + 16 > powerup.x &&
   player.position.y < powerup.y + rect2.height &&
   rect1.height + rect1.y > rect2.y)
}*/
/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  // Render the enemies
  enemies.render(elapsedTime, ctx);

  // Render the backgrounds
  renderBackgrounds(elapsedTime, ctx);

  // Transform the coordinate system using
  // the camera position BEFORE rendering
  // objects in the world - that way they
  // can be rendered in WORLD cooridnates
  // but appear in SCREEN coordinates
  ctx.save();
  ctx.translate(-camera.x, -camera.y);
  renderWorld(elapsedTime, ctx);
  ctx.restore();

  // Render the GUI without transforming the
  // coordinate system
  renderGUI(elapsedTime, ctx);
}

/**
  * @function renderBackgrounds
  * Renders the parallax scrolling backgrounds.
  * From heli in-class assignment
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderBackgrounds(elapsedTime, ctx) {
  var worldCtx = ctx;
  if(player.level == 1)
  {
    ctx.save();

    ctx.translate(0, (-camera.y * 0.2) - 1200);
    tilemaps[0].render(ctx);
    ctx.restore();

    ctx.save();

    ctx.translate(0, (-camera.y * 0.4) + 300);
    tilemaps[1].render(ctx);
    ctx.restore();

    ctx.save();

    ctx.translate(0, (-camera.y + 400));
    tilemaps[2].render(ctx);
    ctx.restore();
  }
  if(player.level == 2)
  {
    ctx.save();

    ctx.translate(0, (-camera.y * 0.2) - 1200);
    tilemaps[3].render(ctx);
    ctx.restore();

    ctx.save();

    ctx.translate(0, (-camera.y * 0.4) + 300);
    tilemaps[4].render(ctx);
    ctx.restore();

    ctx.save();

    ctx.translate(0, (-camera.y + 400));
    tilemaps[5].render(ctx);
    ctx.restore();

    ctx.save();
    ctx.translate(0, (-camera.y + 400));
    ctx.drawImage(
      powerup2,
      0, 0, 24, 28,
      150, 3000, 48, 56
    );
    ctx.restore();
  }
  if(player.level == 3)
  {
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0, canvas.width, canvas.height);

    ctx.save();

    ctx.translate(0, (-camera.y * 0.4) + 300);
    tilemaps[6].render(ctx);
    ctx.restore();

    ctx.save();

    ctx.translate(0, (-camera.y + 400));
    tilemaps[7].render(ctx);
    ctx.restore();

  }
  ctx.save();
  ctx.translate(0, (-camera.y + 400));
  powerupArr.forEach(function(powerup)
  {
    worldCtx.drawImage(
      powerup.img,
      0, 0, 24, 28,
      150, powerup.y, 48, 56
    );
  });
  ctx.restore();
}

/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function renderWorld(elapsedTime, ctx) {
    // Render the bullets
    bullets.render(elapsedTime, ctx);

    // Render the missiles
    missiles.forEach(function(missile) {
      missile.render(elapsedTime, ctx);
    });

    // Render the player
    player.render(elapsedTime, ctx);
}

/**
  * @function renderGUI
  * Renders the game's GUI IN SCREEN COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx
  */
function renderGUI(elapsedTime, ctx) {
  // TODO: Render the GUI
}
