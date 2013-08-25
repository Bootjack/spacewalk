var Crafty, require;

require([], function () {
    'use strict';
    
    Crafty.c('Debris', {
        init: function () {
            this.requires('2D, Box2D, Canvas, Color')
                .attr({w: 512, h: 256})
                .color('rgba(85, 85, 95, 1.0)');
            return this;   
        },        
        debris: function () {
            this.box2d({
                bodyType: 'dynamic',
                density: 7.8 * 1.0,
                friction: 0.8,
                restitution: 0.8
            });
            this.body.ApplyTorque((0.5 + Math.random()) * 500000);
            return this;
        }
    })
});
            