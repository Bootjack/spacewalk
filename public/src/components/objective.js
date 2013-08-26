var Crafty, require;

require([], function () {
    'use strict';
    
    Crafty.c('Objective', {
        init: function () {
            this.requires('2D, Canvas, Color, Collision, WiredHitBox');
            return this;   
        },
        objective: function (config) {
            config = config || {};
            this.onHit('Astronaut', function(){ document.getElementById('updates').innerHTML = "Mission accomplished" });
            return this;
        },
    })
});
