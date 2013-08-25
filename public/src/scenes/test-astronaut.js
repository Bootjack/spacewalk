var Crafty, require;

require([
    'src/components/astronaut',
    'src/components/debris',
    'src/components/walls'
], function () {
    'use strict';

    Crafty.scene('test-astronaut', function () {
        var astronaut, walls;

        Crafty.viewport.init(800, 600, 'cr-stage');
        Crafty.viewport.clampToEntities = false;
        Crafty.viewport.mouselook(true);
               
        Crafty.background('rgb(15, 10, 20)');

        astronaut = Crafty.e('Astronaut').attr({
            x: 50,
            y: 300
        }).astronaut();
        astronaut.body.SetAngle(-0.12 * Math.PI);

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
                
        Crafty.e('Debris').attr({w: 380, h: 256, x: 200, y: 125}).debris();
        Crafty.e('Walls');
    });
});