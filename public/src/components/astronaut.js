var Crafty, require;

require([
    'src/modules/storage',
    'src/modules/drive'
], function () {
    'use strict';
    
    Crafty.c('Astronaut', {
        init: function () {
            this.requires('2D, Canvas, Color, Mouse, Keyboard, Delay')
                .attr({w: 16, h: 32})
                .color('rgba(250, 250, 250, 1.0)');
            return this;
        },

        astronaut: function () {
            this.requires('Box2D');
            var bodyDef = new Box2D.Dynamics.b2BodyDef;
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
            bodyDef.position.Set(this._x / Crafty._PX2M, this._y / Crafty._PX2M);
            this.box2d({
                bodyDef: bodyDef,
                density: 0.1,
                friction: 0.8,
                elasticity: 0.1
            });
            this.propellant = Crafty.e('Storage').storage({
                material: 'propellant',
                capacity: 100,
                quantity: 100
            });
            this.engine = Crafty.e('Drive')
                .drive({
                    driven: this,
                    volume: 1,
                    efficiency: 1,
                    inputs: [this.propellant],
                    x: 0.6 * this._w,
                    y: 0.2 * this._h,
                    angle: -0.5 * Math.PI
                });
            this.shoulders = Crafty.e('2D, Canvas, Color')
                .attr({w: 21, h: 14, x: this._x - 3, y: this._y + 7})
                .color('rgba(240, 240, 240, 1.0)');
            this.visor = Crafty.e('2D, Canvas, Color')
                .attr({w: 11, h: 8, x: this._x + 2, y: this._y + 2})
                .color('rgba(0, 0, 0, 1.0)');
            this.attach(this.shoulders).attach(this.visor);
            this.bind('EnterFrame', this.render);
            return this;
        },

        render: function () {
            return this;
        },
    });
});