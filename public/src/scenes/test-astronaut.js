var Crafty, require;

require([
    'src/components/astronaut',
    'src/components/walls'
], function () {
    'use strict';

    Crafty.scene('test-astronaut', function () {
        var astronaut, walls;

        Crafty.background('rgb(15, 10, 20)');

        astronaut = Crafty.e('Astronaut').attr({
            x: 50,
            y: 50
        }).astronaut();
        astronaut.body.SetAngle(-0.12 * Math.PI);

        astronaut.bind('EnterFrame', function () {
            var self = this;
            document.getElementById('spine-out').innerHTML = 
                'Propellant remaining: ' + astronaut.propellant.quantity;
            if (astronaut.isDown(Crafty.keys.UP_ARROW) || astronaut.isDown(Crafty.keys.W)) {
                astronaut.engine.throttle = 1;
            } else {
                astronaut.engine.throttle = 0;
            }
        })

        walls = Crafty.e('Walls');
    });
});