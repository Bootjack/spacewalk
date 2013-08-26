var Crafty, require;

require([
    'src/components/astronaut',
    'src/components/debris'
], function () {
    'use strict';

    Crafty.scene('test-station', function () {
        var astronaut, walls, viewportVelocity;

        Crafty.viewport.init(800, 600, 'cr-stage');
        Crafty.viewport.clampToEntities = false;
        Crafty.background('rgb(15, 10, 20) url(assets/starfield.jpg)');
        
        astronaut = Crafty.e('Astronaut').attr({
            x: 50,
            y: 300
        }).astronaut();
        astronaut.body.SetAngle(-0.12 * Math.PI);
        
        viewportVelocity = new Box2D.Common.Math.b2Vec2(0, 0);

        Crafty.bind('EnterFrame', function () {
            var x, y, viewportAcceleration = new Box2D.Common.Math.b2Vec2(astronaut._x + Crafty.viewport.x, astronaut._y + Crafty.viewport.y);
            viewportAcceleration.Subtract(new Box2D.Common.Math.b2Vec2(400, 300));
            viewportAcceleration.NegativeSelf();
            viewportVelocity.Add(viewportAcceleration);
            viewportVelocity.Multiply(0.25);
            Crafty.viewport.x += viewportVelocity.x;
            Crafty.viewport.y += viewportVelocity.y;
        });

        astronaut.bind('EnterFrame', function () {
            var self = this;
            document.getElementById('spine-out').innerHTML = 
                'Propellant remaining: ' + (astronaut.eva.propellant.quantity / 10).toFixed(1) + ' seconds';
            if (astronaut.isDown(Crafty.keys.W)) {
                astronaut.eva.jets[2].throttle = 1;
                astronaut.eva.jets[3].throttle = 1;
            } else if (astronaut.isDown(Crafty.keys.S)) {
                astronaut.eva.jets[0].throttle = 1;
                astronaut.eva.jets[1].throttle = 1;
            } else  if (astronaut.isDown(Crafty.keys.A)) {
                astronaut.eva.jets[5].throttle = 1;
            } else if (astronaut.isDown(Crafty.keys.D)) {
                astronaut.eva.jets[4].throttle = 1;
            } else  if (astronaut.isDown(Crafty.keys.Q)) {
                astronaut.eva.jets[0].throttle = 1;
                astronaut.eva.jets[3].throttle = 1;
            } else if (astronaut.isDown(Crafty.keys.E)) {
                astronaut.eva.jets[1].throttle = 1;
                astronaut.eva.jets[2].throttle = 1;
            } else {
                astronaut.eva.jets[0].throttle = 0;
                astronaut.eva.jets[1].throttle = 0;
                astronaut.eva.jets[2].throttle = 0;
                astronaut.eva.jets[3].throttle = 0;
                astronaut.eva.jets[4].throttle = 0;
                astronaut.eva.jets[5].throttle = 0;
            }
        });
        
        astronaut.bind('KeyDown', function () {
            if (astronaut.isDown(Crafty.keys.X)) {
                astronaut.letGo();
            }
            if (astronaut.isDown(Crafty.keys.Z)) {
                 astronaut.setGrasping(!astronaut.grasping);
            }
        });
        
        var i, spin, deb, variance;
        for (i = 0; i < 0; i += 1) {
            variance = (Math.random() - 0.5) * 50;
            spin = i > 1 && i < 6;
            deb = Crafty.e('Debris').attr({w: 20, h: 256, x: i * 40, y: -25 + variance}).debris();    
            if (false) deb.spin(i % 6)    
        }
        
        for (i = 0; i < 50; i += 1) {
            variance = 50 * Math.sin(i % 20);
            spin = i > 1 && i < 6;
            deb = Crafty.e('Debris').attr({w: 20, h: 256, x: i * 40, y: 325 + variance}).debris();    
            if (false) deb.spin(i % 6)         
        }
 
    });
});