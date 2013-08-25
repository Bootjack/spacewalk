var Crafty, require;

require([], function () {
    'use strict';
    
    Crafty.c('Grapple_Gun', {
        init: function () {
            this.requires('2D, Box2D, Canvas, Color')
                .attr({w: 5, h: 12})
                .color('rgba(205, 125, 35, 1.0)');
            return this;   
        },        
        grappleGun: function () {
            var ropeJointDef;
            this.box2d({
                bodyType: 'dynamic',
                density: 7.8 * 0.10,    // 10cm thick solid steel
                friction: 3.0,          // (it has a rubberized grip, of course)
                restitution: 0.9,
                groupIndex: -2
            });

            this.head = Crafty.e('2D, Box2D, Canvas, Color, Delay')
                .attr({x: this._x +1, y: this._y - 6, w: 4, h: 8})
                .color('rgba(205, 125, 35, 1.0)')
                .box2d({
                    bodyType: 'dynamic',
                    density: 7.8 * 0.02,    // 2cm thick solid steel
                    friction: 0.9,          // (it pierces, of course)
                    restitution: 0.9,
                    groupIndex: -2
                });

            ropeJointDef = new Box2D.Dynamics.Joints.b2RopeJointDef;
            ropeJointDef.maxLength = 20;
            ropeJointDef.Initialize(
                this.body,
                this.head.body,
                this.body.GetWorldPoint(
                    new Box2D.Common.Math.b2Vec2(
                        (this._w / 2) / Crafty.box2D.PTM_RATIO,
                        0
                    )
                ),
                this.head.body.GetWorldPoint(
                    new Box2D.Common.Math.b2Vec2(
                        (this.head._w / 2) / Crafty.box2D.PTM_RATIO,
                        this.head._h / Crafty.box2D.PTM_RATIO
                    )
                )
            );
            this.rope = Crafty.box2D.world.CreateJoint(ropeJointDef);           
            
            this.relatch();
            return this;
        },

        relatch: function () {
            var latchJointDef;
            latchJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef;
            latchJointDef.enableLimit = true;
            latchJointDef.lowerTranslation = -0.1;
            latchJointDef.upperTranslation = 0.2;
            latchJointDef.Initialize(
                this.body,
                this.head.body,
                this.body.GetWorldPoint(
                    new Box2D.Common.Math.b2Vec2(
                        0.5 * this._w / Crafty.box2D.PTM_RATIO,
                        0.75 * this._h / Crafty.box2D.PTM_RATIO
                    )
                ),
                this.head.body.GetWorldVector(
                    new Box2D.Common.Math.b2Vec2(0, -1)
                )
            );
            this.latch = Crafty.box2D.world.CreateJoint(latchJointDef);
            return this;
        },

        fire: function () {
            var head, listener, magnitude;
            head = this.head;
            magnitude = 8;
            if (this.latch) {
                Crafty.box2D.world.DestroyJoint(this.latch);
                this.head.body.ApplyForce(
                    this.head.body.GetWorldVector(new Box2D.Common.Math.b2Vec2(0, -1 * magnitude)),
                    this.head.body.GetWorldCenter()
                );
                this.body.ApplyForce(
                    this.body.GetWorldVector(new Box2D.Common.Math.b2Vec2(0, magnitude)),
                    this.body.GetWorldCenter()
                );

                listener = new Box2D.Dynamics.b2ContactListener()
                listener.BeginContact = function (contact) {
                    var bodyA, bodyB, grasp, surface;
                        bodyA = contact.GetFixtureA().GetBody();
                        bodyB = contact.GetFixtureB().GetBody();
                        
                        if (head.body === bodyA) {
                            surface = bodyB;
                        } else if (head.body === bodyB) {
                            surface = bodyA;
                        }
                        
                        if (surface) {
                            grasp = new Box2D.Dynamics.Joints.b2FrictionJointDef();
                            grasp.maxForce = 1000;
                            grasp.maxTorque = 0.1 * Math.PI;
                            grasp.Initialize(head.body, surface, head.body.GetWorldCenter());
                            head.graspJoint = Crafty.box2D.world.CreateJoint(grasp);
                        }
                };
                Crafty.box2D.world.SetContactListener(listener); 
            }
            return this;
        }
    })
});