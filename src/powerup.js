"use strict";

/**
 * @module Enemies
 * A class representing a player's helicopter
 */
module.exports = exports = Powerup;

/**
 * @constructor Enemies
 * Creates an enemy
 */
function Powerup(posY) {
  this.position = {x: 200, y: posY}
  this.img = new Image();
  this.img.src;
  this.health = 5;
}
