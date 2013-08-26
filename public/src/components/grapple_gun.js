var Crafty, require;

require(['src/modules/storage'], function () {
    'use strict';
    
    Crafty.c('Grapple_Gun', {
        init: function () {
            this.requires('2D, Canvas, Color')
                .attr({w: 5, h: 12, z: 5})
            this.locked = false;
            this.ammo = Crafty.e('Storage').storage({
                material: 'hooks',
                capacity: 1,
                quantity: 1
            });
            return this;   
        },
        
        grappleGun: function (config) {
            config = config || {};
            this.ropeLength = 0;
            this.maxRopeLength = 25;       // 15m
            this.segmentInterval = 0.1;    // 5cm
            this.colorString = 'rgba(255, 155, 0, 1.0)';
            this.color(this.colorString);
            
            if (config.ammo) {
                this.ammo.quantity = config.ammo;
                this.ammo.capacity = config.ammo;
            }
            
            this.requires('Box2D').box2d({
                bodyType: 'dynamic',
                density: 7.8 * 0.10,    // 10cm thick solid steel
                friction: 3.0,          // (it has a rubberized grip, of course)
                restitution: 0.9,
                groupIndex: -2
            })    
            
            this.reload();
            return this;
        },

        reload: function () {
            var latchJointDef;
            
            if (this.ammo.remove(1)) {
                this.unbind('EnterFrame', this.payOut);            
                this.ropeLength = 0;
                this.locked = false;
                this.rope = [];
                
                this.head = Crafty.e('2D, Box2D, Canvas, Color, Delay')
                    .attr({x: this._x, y: this._y, w: 3, h: 8})
                    .color('rgba(255, 255, 255, 1.0)')
                    .box2d({
                        bodyType: 'dynamic',
                        density: 7.8 * 0.02,    // 2cm thick solid steel
                        friction: 5.0,          // (it pierces, of course)
                        restitution: 0.9,
                        groupIndex: -2
                    });
                this.head.body.SetPositionAndAngle(
                    this.body.GetWorldPoint(new Box2D.Common.Math.b2Vec2(
                        1 / Crafty.box2D.PTM_RATIO,
                        -2 / Crafty.box2D.PTM_RATIO
                    )),
                    this.body.GetAngle()
                );
                
                latchJointDef = new Box2D.Dynamics.Joints.b2PrismaticJointDef;
                latchJointDef.enableLimit = true;
                latchJointDef.lowerTranslation = -0.05;
                latchJointDef.upperTranslation = 0.05;
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
            }
            return this;
        },

        fire: function () {
            var head, self, listener, magnitude;
            magnitude = 8;
            if (this.latch) {
                self = this;
                head = this.head;
                Crafty.box2D.world.DestroyJoint(this.latch);
                this.latch = undefined;
                this.head.body.ApplyForce(
                    this.head.body.GetWorldVector(new Box2D.Common.Math.b2Vec2(0, -1 * magnitude)),
                    this.head.body.GetWorldCenter()
                );
                this.body.ApplyForce(
                    this.body.GetWorldVector(new Box2D.Common.Math.b2Vec2(0, magnitude)),
                    this.body.GetWorldCenter()
                );

                this.bind('EnterFrame', this.payOut);

                listener = new Box2D.Dynamics.b2ContactListener();
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
                        grasp = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
                        grasp.enableMotor = true;
                        grasp.motorSpeed = 0;
                        grasp.maxMotorTorque = 0.25 * Math.PI;
                        grasp.Initialize(
                            head.body,
                            surface,
                            head.body.GetWorldPoint(new Box2D.Common.Math.b2Vec2(
                                head._w  * 0.5 / Crafty.box2D.PTM_RATIO,
                                0
                            ))
                        );
                        head.graspJoint = Crafty.box2D.world.CreateJoint(grasp);
                        Crafty.b2RemoveContactListener('harpoon.stick');
                        if (self) {
                           self.lock();                            
                        }
                    }
                };
                Crafty.b2AddContactListener('harpoon.stick', listener); 
            }
            return this;
        },

        payOut: function () {
            var distance, segment, segBodyDef, segmentEndPosition, jointDef, parentSegment, parentEndPosition, muzzleEndPosition;
            
            if (this.rope.length) {
                parentSegment = this.rope[this.rope.length - 1];
            } else {
                parentSegment = this.head;
            }
            muzzleEndPosition = this.body.GetWorldPoint(
                new Box2D.Common.Math.b2Vec2(
                    0.5 * this._w / Crafty.box2D.PTM_RATIO,
                    0
                )
            ).Copy();
            parentEndPosition = parentSegment.body.GetWorldPoint(
                new Box2D.Common.Math.b2Vec2(
                    0.5 * parentSegment._w / Crafty.box2D.PTM_RATIO,
                    parentSegment._h / Crafty.box2D.PTM_RATIO
                )            
            ).Copy();
            muzzleEndPosition.Subtract(parentEndPosition);
            distance = muzzleEndPosition.Length();
            
            if (!this.locked && distance >= this.segmentInterval) {
                if (this.ropeLength < this.maxRopeLength) {
                   segment = Crafty.e('2D, Canvas, Color')
                        .attr({x: this._x + this._w / 2, y: this._y, h: 3, w: 3})
                        .color(this.colorString);
                        
                    segBodyDef = new Box2D.Dynamics.b2BodyDef();
                    segBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
                    segBodyDef.linearDamping = 0.25;   
                    segBodyDef.position.Set(segment._x / Crafty.box2D.PTM_RATIO, segment._y / Crafty.box2D.PTM_RATIO);
                    segment.requires('Box2D');
                    segment.box2d({bodyDef: segBodyDef, density: 0.03, restitution: 0.1, groupIndex: -2});
                    
                    segmentEndPosition = segment.body.GetWorldPoint(new Box2D.Common.Math.b2Vec2(
                        0.5 * segment._w / Crafty.box2D.PTM_RATIO,
                        0
                    )).Copy();

                    segmentEndPosition.Subtract(parentEndPosition);
                    distance = segmentEndPosition.Length();
        
                    jointDef = new Box2D.Dynamics.Joints.b2DistanceJointDef;
                    jointDef.Initialize(
                        parentSegment.body,
                        segment.body,
                        parentSegment.body.GetWorldCenter(),
                        segment.body.GetWorldCenter()
                    );
                    segment.joint = Crafty.box2D.world.CreateJoint(jointDef);

                    this.ropeLength += distance + 2 * segment._h / Crafty.box2D.PTM_RATIO;

                    this.rope.push(segment);
                } else {
                    this.lock();
                }
            }

            return this;
        },

        lock: function () {
            var ropeEnd, jointDef, endPosition, distance, headPosition, totalDistance;

            if (!this.locked && this.rope.length) {
                this.locked = true;
                ropeEnd = this.rope[this.rope.length - 1];
            
                jointDef = new Box2D.Dynamics.Joints.b2WeldJointDef;
                jointDef.Initialize(
                    ropeEnd.body,
                    this.body,
                    ropeEnd.body.GetWorldCenter(),
                    this.body.GetWorldCenter()
                );
                this.terminus = Crafty.box2D.world.CreateJoint(jointDef);
                
                jointDef = new Box2D.Dynamics.Joints.b2RopeJointDef;
                jointDef.maxLength = this.ropeLength;
                jointDef.Initialize(
                    this.head.body,
                    ropeEnd.body,
                    this.head.body.GetWorldCenter(new Box2D.Common.Math.b2Vec2(
                        0.5 * this.head._w / Crafty.box2D.PTM_RATIO,
                        this.head._h / Crafty.box2D.PTM_RATIO
                    )),
                    ropeEnd.body.GetWorldPoint(new Box2D.Common.Math.b2Vec2(
                        0.5 * this._w / Crafty.box2D.PTM_RATIO,
                        0
                    ))
                );
                this.ropeLimiter = Crafty.box2D.world.CreateJoint(jointDef);
            }
            return this;
        },
        
        sever: function () {
            if (!this.locked) {
                this.lock();
            }
            Crafty.box2D.world.DestroyJoint(this.terminus);
            return this;
        },

        affix: function(target){
            var affixDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
            affixDef.enableMotor = true;
            affixDef.motorSpeed = 0;
            affixDef.maxMotorTorque = 0.25 * Math.PI;
            affixDef.Initialize(
                this.body,
                target.body,
                this.body.GetWorldPoint(new Box2D.Common.Math.b2Vec2(
                    0.5 * this._w / Crafty.box2D.PTM_RATIO,
                    this._h / Crafty.box2D.PTM_RATIO
                ))
            );
            this.affixed = Crafty.box2D.world.CreateJoint(affixDef);
            return this;
        }
    })
});