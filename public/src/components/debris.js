var Crafty, require;

require([], function () {
    'use strict';
    
    Crafty.c('Debris', {
        init: function () {
            this.requires('2D, Box2D, Canvas, Color')
                .color('rgba(85, 85, 95, 1.0)');
            return this;   
        },        
        debris: function (config) {
            config = config || {};
            this.box2d({
                bodyType: 'dynamic',
                density: 7.8 * 1.0,
                friction: 0.8,
                restitution: 0.8,
                categoryBits: 2
            });
            if (config.randomSpin) {
                this.spin((Math.random() - 0.5) * 5);
            }
            return this;
        },
        spin: function (magnitude) {
            this.body.ApplyTorque(magnitude * this._w * this._h);
        }
    })
});
            