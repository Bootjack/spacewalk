var Crafty, require;

require([
    'src/components/eva_suit'
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
            var bodyDef, suitJointDef, suitJoint;
            bodyDef = new Box2D.Dynamics.b2BodyDef;
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
            bodyDef.position.Set(this._x / Crafty.box2D.PTM_RATIO, this._y / Crafty.box2D.PTM_RATIO);
            this.box2d({
                bodyDef: bodyDef,
                density: 1,
                friction: 0.8,
                restitution: 0.1
            });
            
            this.eva = Crafty.e('2D, EVA_Suit, Canvas, Color')
                .attr({x: this._x - 2.5, y: this._y + 7})
                .color('rgba(240, 240, 240, 1.0)')
                .eva();
            
            suitJointDef = new Box2D.Dynamics.Joints.b2WeldJointDef;
            suitJointDef.collideConnected = false;
            suitJointDef.Initialize(this.body, this.eva.body, this.body.GetWorldCenter());
            suitJoint = Crafty.box2D.world.CreateJoint(suitJointDef);
            
            this.visor = Crafty.e('2D, Canvas, Color')
                .attr({w: 12, h: 8, x: this._x + 2, y: this._y + 2})
                .color('rgba(0, 0, 0, 1.0)');
            this.attach(this.visor);
            this.bind('EnterFrame', this.render);
            return this;
        },

        render: function () {
            return this;
        },
    });
});