/**
 * Created by Travis on 2014/7/12.
 */
var current_progress = 0;

var create_listeners = function () {
    body = $('body');
    body.tap(function () {
        if (crazy_mario.collidesWithArray(blocks.list)) {
            crazy_mario.xv = jump_speed;
            crazy_mario.applyXVelocity();
        }
    });
};

var refresh_map = function () {

};

var paint = function (ticker) {
    cycle.next(5).update();

    if (!crazy_mario.collidesWithArray(blocks.list)) {
        crazy_mario.xv --;
        crazy_mario.applyXVelocity();
    }
//    crazy_mario.yv = 2;
//    crazy_mario.applyYVelocity();
    crazy_mario.update();

    refresh_map();
};

// init map
var init_map = function () {
    map = generateMap({height: map_height, length: 100}, map);
    for (var i = 0; i < map.length; i ++) {
        for (var j = 0; j < map.height; j ++) {
            var type = getElementAt(map, j, i);
            if (!type) continue;
            if (type == 1) {
                var stone = scene.Sprite('images/stone.png');
            } else if (type == 2) {

            }

        }
    }
};

var draw_map = function (map) {

};

var init = function () {
    scene = sjs.Scene({w:screen_w, h:screen_h});

    // load the images in parallel. When all the images are
    // ready, the callback function is called.
    scene.loadImages(['images/mario_8_bit.png','images/stone.png', 'images/medicine.png'], function() {

        init_map();

        // define the walking movements of mario
        var positions = [];
        for (var i = 0; i < 20; i++) {
            positions.push([i * 21, 0, 5]);
        };
        cycle = scene.Cycle(positions);

        // create mario and set movements
        crazy_mario = scene.Sprite('images/mario_8_bit.png');
        crazy_mario.size(21,46);
        cycle.addSprite(crazy_mario);
        cycle.update();

        // various transformations
        crazy_mario.position(screen_w, mario_init_y);
        crazy_mario.rotate(Math.PI / 2);
        crazy_mario.update();

        ticker = scene.Ticker(paint);
        create_listeners();
        ticker.run();
    });

};



























