var Crafty, require;

require([
    'src/components/eva_suit'
], function () {
    'use strict';
    
    Crafty.b2AddContactListener = function (name, listener) {
        var i, masterListener = new Box2D.Dynamics.b2ContactListener();
        
        Crafty._b2ContactListeners = Crafty._b2ContactListeners || {};
        Crafty._b2ContactListeners[name] = listener;

        masterListener.BeginContact = function (contact) {
            for (i in Crafty._b2ContactListeners) {
                if (Crafty._b2ContactListeners.hasOwnProperty(i) 
                    && 'undefined' !== typeof Crafty._b2ContactListeners[i]
                    && 'function' === typeof Crafty._b2ContactListeners[i].BeginContact) {
                    Crafty._b2ContactListeners[i].BeginContact(contact);
                }
            }
        }
        masterListener.EndContact = function (contact) {
            for (i in Crafty._b2ContactListeners) {
                if (Crafty._b2ContactListeners.hasOwnProperty(i) 
                    && 'undefined' !== typeof Crafty._b2ContactListeners[i]
                    && 'function' === typeof Crafty._b2ContactListeners[i].EndContact) { 
                    Crafty._b2ContactListeners[i].EndContact(contact);
                }
            }
        }
        masterListener.PreSolve = function (contact, oldManifold) {
            for (i in Crafty._b2ContactListeners) {
                if (Crafty._b2ContactListeners.hasOwnProperty(i) 
                    && 'undefined' !== typeof Crafty._b2ContactListeners[i]
                    && 'function' === typeof Crafty._b2ContactListeners[i].PreSolve) {
                    Crafty._b2ContactListeners[i].PreSolve(contact, oldManifold);
                }
            }
        }
        masterListener.PostSolve = function (contact, impulse) {
            for (i in Crafty._b2ContactListeners) {
                if (Crafty._b2ContactListeners.hasOwnProperty(i) 
                    && 'undefined' !== typeof Crafty._b2ContactListeners[i]
                    && 'function' === typeof Crafty._b2ContactListeners[i]) {
                    Crafty._b2ContactListeners[i].PostSolve(contact, impulse);
                }
            }
        }

        Crafty.box2D.world.SetContactListener(masterListener);
    }
    
    Crafty.c('Astronaut', {
        init: function () {
            this.requires('2D, Canvas, Color, Mouse, Keyboard, Delay')
                .attr({w: 16, h: 32})
                .color('rgba(250, 250, 250, 1.0)');
            return this;
        },

        astronaut: function () {
            this.requires('Box2D');
            var self, bodyDef, leftArmJointDef, leftArmJoint, rightArmJointDef, rightArmJoint, suitJointDef, suitJoint;
            
            self = this;
            
            bodyDef = new Box2D.Dynamics.b2BodyDef;
            bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
            bodyDef.linearDamping = 0.05;
            bodyDef.position.Set(this._x / Crafty.box2D.PTM_RATIO, this._y / Crafty.box2D.PTM_RATIO);
            this.box2d({
                bodyDef: bodyDef,
                density: 1,
                friction: 0.8,
                restitution: 0.2,
                groupIndex: -1
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
            
            this.arms = {
                left: Crafty.e('2D, Box2D, Canvas, Color, Delay')
                    .attr({x: this._x - 11, y: this._y + 10, w: 12, h: 5})
                    .color('rgba(240, 240, 240, 1.0)')
                    .box2d({
                        bodyType: 'dynamic',
                        friction: 0.8,
                        restitution: 0.1,
                        groupIndex: -1
                    }),
                right: Crafty.e('2D, Box2D, Canvas, Color, Delay')
                    .attr({x: this._x + this._w - 1, y: this._y + 10, w: 12, h: 5})
                    .color('rgba(240, 240, 240, 1.0)')
                    .box2d({
                        bodyType: 'dynamic',
                        friction: 0.8,
                        restitution: 0.1,
                        groupIndex: -1
                    })
            }
            
            leftArmJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
            leftArmJointDef.collideConnected = false;
            leftArmJointDef.enableLimit = true;
            leftArmJointDef.lowerAngle = -0.4 * Math.PI;
            leftArmJointDef.upperAngle = 0.2 * Math.PI;
            leftArmJointDef.enableMotor = true;
            leftArmJointDef.motorSpeed = 0.025 * Math.PI;
       		leftArmJointDef.maxMotorTorque = 0.1;
            leftArmJointDef.Initialize(
                this.body,
                this.arms.left.body,
                this.arms.left.body.GetWorldPoint(
                    new Box2D.Common.Math.b2Vec2(11 / Crafty.box2D.PTM_RATIO, 2.5 / Crafty.box2D.PTM_RATIO)
                )
            );
            leftArmJoint = Crafty.box2D.world.CreateJoint(leftArmJointDef);
            
            rightArmJointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
            rightArmJointDef.collideConnected = false;
            rightArmJointDef.enableLimit = true;
            rightArmJointDef.lowerAngle = -0.2 * Math.PI;
            rightArmJointDef.upperAngle = 0.4 * Math.PI;
            rightArmJointDef.enableMotor = true;
            rightArmJointDef.motorSpeed = -0.025 * Math.PI;
       		rightArmJointDef.maxMotorTorque = 0.1;
            rightArmJointDef.Initialize(
                this.body,
                this.arms.right.body,
                this.arms.right.body.GetWorldPoint(
                    new Box2D.Common.Math.b2Vec2(1 / Crafty.box2D.PTM_RATIO, 2.5 / Crafty.box2D.PTM_RATIO)
                )
            );
            rightArmJoint = Crafty.box2D.world.CreateJoint(rightArmJointDef);            
            
            var listener = new Box2D.Dynamics.b2ContactListener()
            listener.BeginContact = function (contact) {
                var arm, bodyA, bodyB, grasp, localHandVector, surface;
                if (self.grasping) {
                    bodyA = contact.GetFixtureA().GetBody();
                    bodyB = contact.GetFixtureB().GetBody();
                    if (self.arms.left.body === bodyA || self.arms.left.body === bodyB) {
                        arm = self.arms.left;
                        localHandVector = new Box2D.Common.Math.b2Vec2(
                            2 / Crafty.box2D.PTM_RATIO,
                            2.5 / Crafty.box2D.PTM_RATIO
                        );
                    } else if (self.arms.right.body === bodyA || self.arms.right.body === bodyB) {
                        arm = self.arms.right;
                        localHandVector = new Box2D.Common.Math.b2Vec2(
                            13 / Crafty.box2D.PTM_RATIO,
                            2.5 / Crafty.box2D.PTM_RATIO
                        );
                    }
                    
                    if (self.arms.left.body === bodyA || self.arms.right.body === bodyA) {
                        surface = bodyB;
                    } else if (self.arms.left.body === bodyB || self.arms.right.body === bodyB) {
                        surface = bodyA;
                    }
                    
                    if (arm && surface) {
                        grasp = new Box2D.Dynamics.Joints.b2FrictionJointDef();
                        grasp.maxForce = 9;
                        grasp.maxTorque = 0.5 * Math.PI;
                        grasp.Initialize(arm.body, surface, arm.body.GetWorldPoint(localHandVector));
                        arm.graspJoint = Crafty.box2D.world.CreateJoint(grasp);
                    }
                }
            };
            listener.PreSolve = function (contact) {
                var arm, bodyA, bodyB;
                bodyA = contact.GetFixtureA().GetBody();
                bodyB = contact.GetFixtureB().GetBody();
                if (self.arms.left.body === bodyA || self.arms.left.body === bodyB) {
                    arm = self.arms.left;
                } else if (self.arms.right.body === bodyA || self.arms.right.body === bodyB) {
                    arm = self.arms.right;
                }
                if (arm && arm.graspJoint) {
                    arm.delay(function () {
                        var separation = arm.graspJoint.GetAnchorA().Copy();
                        separation.Subtract(arm.graspJoint.GetAnchorB());
                        if (separation.Length() > 0.15) {
                            Crafty.box2D.world.DestroyJoint(arm.graspJoint);
                        }
                    }, 100, -1);
                }
            }
            Crafty.b2AddContactListener('astronaut.grasp', listener);

            this.setGrasping(true);

            this.bind('EnterFrame', this.render);
            return this;
        },

        render: function () {
            return this;
        },
        
        letGo: function () {
            var self = this;
            if (this.arms.left.graspJoint) {
                Crafty.box2D.world.DestroyJoint(this.arms.left.graspJoint);
            }
            if (this.arms.right.graspJoint) {
                Crafty.box2D.world.DestroyJoint(this.arms.right.graspJoint);
            }
            this.delay(function () {
                self.setGrasping(true);
            }, 500)
            this.setGrasping(false);
        },
        
        setGrasping: function (doGrasp) {
            this.grasping = doGrasp;
        }
    });
});