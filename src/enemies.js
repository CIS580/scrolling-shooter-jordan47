"use strict";

/* Classes and Libraries */
const Vector = require('./vector');
//const Missile = require('./missile');

/* Constants */
const ENEMY_SPEED = 20 * Math.random();
const BULLET_SPEED = 5;

/**
 * @module Enemies
 * A class representing a player's helicopter
 */
module.exports = exports = Enemies;

/**
 * @constructor Enemies
 * Creates an enemy
 */
function Enemies(player) {
  this.position = {x: 200, y: Math.random() * 300 + player.position.y};
  this.velocity = {x: 0, y: 0};
  this.type = 5 * Math.random()
  this.img = new Image();
  this.img.src = 'assets/enemy1.png';
  this.health = 20;
  console.log(this.type);
}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemies.prototype.update = function(elapsedTime, player) {

  // set the velocity
  this.velocity.x = 0;
  this.velocity.y = 0;
  switch(this.type)
  {
    case 1:
      this.velocity.y -= 5;
      break;
  }

  // determine player angle
  this.angle = 0;
  if(this.velocity.x < 0) this.angle = -1;
  if(this.velocity.x > 0) this.angle = 1;

  // move the player
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;

}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Enemies.prototype.render = function(elapasedTime, ctx) {
  var offset = this.angle * 23;
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
  ctx.drawImage(this.img, 48+offset, 57, 23, 27, -12.5, -12, 23, 27);
  ctx.restore();
}
