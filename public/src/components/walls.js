var Crafty, require;

require([], function () {
    'use strict';
    
    Crafty.c('Walls', {
        init: function () {
            var bodyDef = new Box2D.Dynamics.b2BodyDef;
            bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
            bodyDef.position.Set(1 / Crafty.box2D.PTM_RATIO, 0 / Crafty.box2D.PTM_RATIO);
            Crafty.e('2D, Canvas, Color, Box2D')
                .attr({h: 600, w: 10})
                .color('rgba(100, 100, 100, 1.0)')
                .box2d({bodyDef: bodyDef, elasticity: 0.2});
    
            bodyDef.position.Set(790 / Crafty.box2D.PTM_RATIO, 0 / Crafty.box2D.PTM_RATIO);
            Crafty.e('2D, Canvas, Color, Box2D')
                .attr({h: 600, w: 10})
                .color('rgba(100, 100, 100, 1.0)')
                .box2d({bodyDef: bodyDef, elasticity: 0.2});
    
            bodyDef.position.Set(10 / Crafty.box2D.PTM_RATIO, 0 / Crafty.box2D.PTM_RATIO);
            Crafty.e('2D, Canvas, Color, Box2D')
                .attr({h: 10, w: 780})
                .color('rgba(100, 100, 100, 1.0)')
                .box2d({bodyDef: bodyDef, elasticity: 0.2});
    
            bodyDef.position.Set(10 / Crafty.box2D.PTM_RATIO, 590 / Crafty.box2D.PTM_RATIO);
            Crafty.e('2D, Canvas, Color, Box2D')
                .attr({h: 10, w: 780})
                .color('rgba(100, 100, 100, 1.0)')
                .box2d({bodyDef: bodyDef, elasticity: 0.2});
            return this;
        }
    });
});