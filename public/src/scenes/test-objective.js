var Crafty, require;

require([
    'src/components/astronaut',
    'src/components/grapple_gun',
    'src/components/debris',
    'src/components/walls',
    'src/components/objective'
], function () {
    'use strict';

    Crafty.scene('test-objective', function () {
        var astronaut, grappleGun, debris, objective, walls;

        Crafty.viewport.init(800, 600, 'cr-stage');
        Crafty.viewport.clampToEntities = false;
        Crafty.viewport.mouselook(true);
               
        Crafty.background('rgb(15, 10, 20)');

        astronaut = Crafty.e('Astronaut').attr({
            x: 50,
            y: 100
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
          
        grappleGun = Crafty.e('Grapple_Gun').attr({
            x: astronaut.arms.right._x + astronaut.arms.right._w + 10,
            y: astronaut.arms.right._y
        }).grappleGun({ammo: 3});
        grappleGun.body.SetAngle(0.5 * Math.PI);
        grappleGun.affix(astronaut.arms.right);
  
        astronaut.bind('KeyDown', function (e) {
            if (astronaut.isDown(Crafty.keys.SPACE)) {
                grappleGun.fire();
            }
            if (astronaut.isDown(Crafty.keys.C)) {
                grappleGun.sever();
            }
            if (astronaut.isDown(Crafty.keys.R)) {
                grappleGun.reload();
            }
            if (astronaut.isDown(Crafty.keys.X)) {
                astronaut.letGo();
            }
            if (astronaut.isDown(Crafty.keys.Z)) {
                 astronaut.setGrasping(!astronaut.grasping);
            }
        });
        
        objective = Crafty.e('Objective').attr({
            w: 100, 
            h: 10, 
            x: 350,
            y: 250,
            color: 'rgb(200,100,250)'
        }).objective();
        debris = Crafty.e('Debris');
        
        // need to attach Collision entity after setting attributes of Box2D entity
        // but before calling constructor, it seems
        debris.attr({w: 200, h: 150, x: 300, y: 300 })
        .attach(objective)
        .debris();
         
        Crafty.e('Walls');
    });
});
