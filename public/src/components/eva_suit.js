var Crafty, require;

require([
    'src/modules/storage',
    'src/modules/drive'
], function () {
    'use strict';
    
    Crafty.c('EVA_Suit', {
        init: function () {
            this.requires('2D').attr({w: 21, h: 14});
            return this;   
        },        
        eva: function () {
            var bodyDef = new Box2D.Dynamics.b2BodyDef;
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
            bodyDef.position.Set(this._x / Crafty.box2D.PTM_RATIO, this._y / Crafty.box2D.PTM_RATIO);
            
            this.requires('Box2D')
                .box2d({
                    bodyDef: bodyDef,
                    density: 6.0 * 0.5,
                    friction: 0.5,
                    restitution: 0.5,
                    groupIndex: -1
                });

            this.propellant = Crafty.e('Storage').storage({
                material: 'propellant',
                capacity: 100,
                quantity: Infinity
            });

            this.jets = [
                // Top left jet
                Crafty.e('Drive').drive({
                    driven: this,
                    volume: 0.5,
                    efficiency: 40,
                    inputs: [this.propellant],
                    x: 0,
                    y: 0,
                    angle: 0.5 * Math.PI
                }),
                // Top right jet
                Crafty.e('Drive').drive({
                    driven: this,
                    volume: 0.5,
                    efficiency: 40,
                    inputs: [this.propellant],
                    x: this._w,
                    y: 0,
                    angle: 0.5 * Math.PI
                }),
                // Bottom left jet
                Crafty.e('Drive').drive({
                    driven: this,
                    volume: 0.5,
                    efficiency: 40,
                    inputs: [this.propellant],
                    x: 0,
                    y: this._h,
                    angle: -0.5 * Math.PI
                }),
                // Bottom right jet
                Crafty.e('Drive').drive({
                    driven: this,
                    volume: 0.5,
                    efficiency: 40,
                    inputs: [this.propellant],
                    x: this._w,
                    y: this._h,
                    angle: -0.5 * Math.PI
                }),
                // Lateral left jet
                Crafty.e('Drive').drive({
                    driven: this,
                    volume: 1,
                    efficiency: 40,
                    inputs: [this.propellant],
                    x: 0,
                    y: 8,
                    angle: 0
                }),
                // Lateral right jet
                Crafty.e('Drive').drive({
                    driven: this,
                    volume: 1,
                    efficiency: 40,
                    inputs: [this.propellant],
                    x: this._w,
                    y: 8,
                    angle: -1 * Math.PI
                })
            ];
            return this;
        }
    });
});