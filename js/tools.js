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
    draw_map();
    current_progress += global_speed;
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
    extend_map();
    draw_map();
};
var extend_map = function () {
    map = generateMap({height: map_height, length: map_growth}, map);
    console.log(map);

    // add the extended part of the map to the blocks
    for (var i = map.length - map_growth; i < map.length; i ++) {
        console.log(map.mapContent[i]);
        for (var j = 0; j < map.height; j ++) {
            var type = getElementAt(map, j, i);
            if (!type) continue;
            var block;
            if (1 == type) {
                block = scene.Sprite('images/stone.png');

            } else if (2 == type) {
                block = scene.Sprite('images/medicine.png');
            }
            block.position(j * block_size[1], i * block_size[0] - current_progress);
            blocks.add(block);
        }
    }
};

var draw_map = function () {
    // if map end is nigh, extend the original map
//    if (map.length < current_progress + map_buffer_size) {
//        extend_map();
//    }
    console.log(blocks.length);
    // update blocks' position
    for (var i = 0; i < blocks.length; i ++) {
        var block = blocks.list[i];
        // if block goes beyond the map, eliminate it
//        if (block.y < current_progress) {
//            blocks.remove(block);
//            block.remove();
//            i --;
//        } else {
//            block.yv = - global_speed;
//            block.applyYVelocity();
//            block.update();
//        }
        block.yv = - global_speed;
        block.applyYVelocity();
        block.update();
    }
};

var init = function () {
    scene = sjs.Scene({w:screen_w, h:screen_h});

    // load the images in parallel. When all the images are
    // ready, the callback function is called.
    scene.loadImages(['images/mario_8_bit.png', 'images/stone.png', 'images/medicine.png'], function() {

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



























