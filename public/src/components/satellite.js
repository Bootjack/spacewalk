var Crafty, require;

require([], function () {
    'use strict';
    
    function scaleShape(shape, scale) {
        scale = scale || Crafty.box2D.PTM_RATIO;
        for (i = 0; i < shape.length; i += 1) {
            shape[i][0] *= Crafty.box2D.PTM_RATIO;
            shape[i][1] *= Crafty.box2D.PTM_RATIO;
        }
        return shape;
    }
    
    Crafty.c('Satellite', {
        init: function () {
            this.requires('2D');
        },
        
        satellite: function () {
            var i, filter, main, frontHub, rearHub, tail, antennaPanel, antennaJoint, antennaJointDef;

    		filter = new b2FilterData();
    		filter.categoryBits = 0x0001;
    		filter.maskBits = 0xffff;
    		filter.groupIndex = 0;
    		
            main = [
                [-0.25, -1],
                [5.5, -1],
                [5.5, 1],
                [-0.25, 1],
                [-1, 0.5],
                [-1, -0.5]
            ];
            
            frontHub = [
                [0.2, -2.35],
                [1.5, -2.5],
                [1.5, 2.5],
                [0.2, 2.35]
            ];
            
            rearHub = [
                [3.75, -2.5],
                [5.0, -2.35],
                [5.0, 2.35],
                [3.75, 2.5]
            ];
            
            antennaPanel = [
                [0.75, -2.5],
                [1.0, -2.35],
                [1.0, 2.35],
                [0.75, 2.5]
            ];        
            
            tail = new Box2D.Dynamics.b2FixtureDef();
            tail.shape = new Box2D.Collision.Shapes.b2CircleShape(0.75);
            tail.shape.SetLocalPosition(new Box2D.Common.Math.b2Vec2(5.5, 0));
            tail.filter = filter;
            tail.density = 7.8 * 1.0;
            tail.friction = 0.5;
            tail.restitution = 0.6;
            
            this.requires('Box2D')
                .box2d({
                    bodyType: 'dynamic',
                    density: 7.8 * 1.0,
                    friction: 0.5,
                    restitution: 0.6,
                    shape: scaleShape(main)
                });

            this.addFixture({
                density: 7.8 * 1.0,
                friction: 0.5,
                restitution: 0.6,
                shape: scaleShape(frontHub)
            });
            this.addFixture({
                density: 7.8 * 1.0,
                friction: 0.5,
                restitution: 0.6,
                shape: scaleShape(rearHub)
            });
            this.fixtures.push(this.body.CreateFixture(tail));
            
            this.antenna = Crafty.e('2D, Box2D').attr({
                x: this._x + 7.5 * Crafty.box2D.PTM_RATIO,
                y: this._y,
                w: 20
            }).box2d({
                bodyType: 'dynamic',
                shape: 'circle'    
            });
            this.antenna.addFixture({
                density: 7.8 * 1.0,
                friction: 0.5,
                restitution: 0.6,
                shape: scaleShape(antennaPanel)
            });
            
            antennaJointDef = new Box2D.Dynamics.Joints.b2DistanceJointDef;
            antennaJointDef.collideConnected = true;
            antennaJointDef.Initialize(
                this.body,
                this.antenna.body,
                this.body.GetWorldPoint(new Box2D.Common.Math.b2Vec2(4.5, 0)),
                this.antenna.body.GetWorldPoint(new Box2D.Common.Math.b2Vec2(0.5, -2.35))
            );
            antennaJoint = Crafty.box2D.world.CreateJoint(antennaJointDef);

            antennaJointDef = new Box2D.Dynamics.Joints.b2DistanceJointDef;
            antennaJointDef.collideConnected = true;
            antennaJointDef.Initialize(
                this.body,
                this.antenna.body,
                this.body.GetWorldPoint(new Box2D.Common.Math.b2Vec2(4.5, 0)),
                this.antenna.body.GetWorldPoint(new Box2D.Common.Math.b2Vec2(0.5, 2.35))
            );
            antennaJoint = Crafty.box2D.world.CreateJoint(antennaJointDef);

            return this;
        }
    })
});