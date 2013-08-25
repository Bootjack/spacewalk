var Crafty, require;

require([], function () {
    'use strict';
    
    Crafty.c('Grapple_Gun', {
        init: function () {
            this.requires('2D, Box2D, Canvas, Color')
                .attr({w: 5, h: 12})
                .color('rgba(185, 155, 35, 1.0)');
            return this;   
        },        
        grappleGun: function () {
            var ropeJointDef;
            this.box2d({
                bodyType: 'dynamic',
                density: 7.8 * 0.05,    // 5cm thick solid steel
                friction: 1.0,          // (it has a rubberized grip, of course)
                restitution: 0.9
            });

            this.head = Crafty.e('2D, Box2D, Canvas, Color')
                .attr({x, y, w: 6, h: 8})
                .color('rgba(185, 155, 35, 1.0)')
                .box2d({
                    bodyType: 'dynamic',
                    density: 7.8 * 0.05,    // 5cm thick solid steel
                    friction: 1.0,          // (it has a rubberized grip, of course)
                    restitution: 0.9
                });

            ropeJointDef = new Box2D.Dynamics.Joints.b2RopeJointDef;
            ropeJointDef.maxLength = 15;
            ropeJointDef.Initialize(
                this.body,
                this.head.body,
                this.body.GetWorldPoint(
                    new Box2D.Common.Math.b2Vec2(
                        this._w * Crafty.box2D.PTM_RATIO / 2,
                        0
                    )
                ),
                this.head.body.GetWorldPoint(
                    new Box2D.Common.Math.b2Vec2(
                        this.head._w * Crafty.box2D.PTM_RATIO / 2,
                        this.head._h * Crafty.box2D.PTM_RATIO
                    )
                )
            );
            this.ropeJoint = Crafty.box2D.world.CreateJoint(ropeJointDef);

            return this;
        }
    })
});