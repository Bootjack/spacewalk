var require, window;

(function () {
    'use strict';

    require(['src/crafty'], function (Crafty) {
        window.Crafty = Crafty;
        require(['src/box2d'], function () {
            //start Crafty
            Crafty._PX2M = 25;
            Crafty.init(800, 600);
            Crafty.canvas.init();
            Crafty.box2D.init(0, 0, Crafty._PX2M, true);
            //Crafty.box2D.showDebugInfo();

            //the loading screen - that will be display while assets loaded
            Crafty.scene("loading", function () {


                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 25, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Tugboat Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-tugboat');
                    });

                Crafty.e('2D, HTML, Mouse')
                    .attr({x: 25, y: 75, w: 250, h: 25})
                    .replace('<a href="#" class="scene-link">Guidance Test</a>')
                    .bind('Click', function (e) {
                        e.preventDefault();
                        Crafty.scene('test-guidance');
                    });

                //when everything is loaded, run the main scene
                require([
                    'src/scenes/test-silo',
                    'src/scenes/test-tugboat'
                ], function () {

                });

            });

            //automatically play the loading scene
            Crafty.scene("loading");
        });
    });
}());