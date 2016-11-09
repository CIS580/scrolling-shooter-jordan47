"use strict";

/**
 * @module Missle
module.exports = exports = Missle;

/**
 * @constructor Missle
 * Creates a Missle
 * @param pos : Holds the missle's position
 */
function Missle(pos) {
  this.position = pos;
  this.image = new Image();
  this.image.src = encodeURI('/assets/missle.png')
}



/**
 * @function update
 * @param {DOMHighResTimeStamp} elapsedTime
 */
Missle.prototype.update = function(elapsedTime) {
    this.pos.y -= 3;
}

/**
 * @function render
 * Renders all bullets in our array.
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Missle.prototype.render = function(elapsedTime, ctx) {
  ctx.drawImage(
    // image
    this.image,
    // source rectangle
    0, 0, 236, 339,
    // destination rectangle
    this.pos.x, this.pos.y, 13, 13
  )
}
