var require, window;

(function () {
    'use strict';

    require(['src/crafty'], function (Crafty) {
        window.Crafty = Crafty;
        require(['src/box2d'], function () {
            //start Crafty
            Crafty.init(800, 600);
            Crafty.canvas.init();
            Crafty.box2D.init(0, 0, 16, true);

            //the loading screen - that will be display while assets loaded
            Crafty.scene("loading", function () {

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 25, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Astronaut Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-astronaut');
                    });

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 75, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Satellite Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-satellite');
                    });

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 125, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Grappling Gun Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-grappling-gun');
                    });

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 325, y: 25, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Linear Level Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-station');
                    });
                    
                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 325, y: 75, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Objective Test</a>')
                    .bind('Click', function(e) {
                        e.preventDefault();
                        Crafty.scene('test-objective');
                    });

                //when everything is loaded, run the main scene
                require([
                    'src/scenes/test-astronaut',
                    'src/scenes/test-satellite',
                    'src/scenes/test-grappling-gun',
                    'src/scenes/test-station',
                    'src/scenes/test-objective'
                ], function () {

                });

            });

            //automatically play the loading scene
            Crafty.scene("loading");
        });
    });
}());
