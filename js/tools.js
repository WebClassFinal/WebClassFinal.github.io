/**
 * Created by Travis on 2014/7/12.
 */


var create_listeners = function () {
    body = $('body');
    body.tap(function () {
        if (crazy_mario.collidesWithArray(blocks)) {
            crazy_mario.xv = jump_speed;
            crazy_mario.applyXVelocity();
        }
    });
};

var refresh_map = function () {
    for (var i = 0; i < blocks.length; i ++) {
        blocks[i].move(0, - global_speed);
        blocks[i].update();
    }
}

var paint = function (ticker) {
    cycle.next(5).update();

    if (!crazy_mario.collidesWithArray(blocks)) {
        crazy_mario.xv --;
        crazy_mario.applyXVelocity();
    }
//    crazy_mario.yv = 2;
//    crazy_mario.applyYVelocity();
    crazy_mario.update();

    refresh_map();
};

var init = function () {
    var scene = sjs.Scene({w:screen_w, h:screen_h});

    // load the images in parallel. When all the images are
    // ready, the callback function is called.
    scene.loadImages(['img/mario_8_bit.jpg','img/ground.png'], function() {
        // define the walking movements of mario
        var positions = [];
        for (var i = 0; i < 20; i++) {
            positions.push([i * 21, 0, 5]);
        };
        cycle = scene.Cycle(positions);

        // create mario and set movements
        crazy_mario = scene.Sprite('img/mario_8_bit.jpg');
        crazy_mario.size(21,46);
        cycle.addSprite(crazy_mario);
        cycle.update();

        // create ground
        var ground_num = screen_h / (2 * block_size[0]);

        for (var i = 0; i < ground_num; i ++) {
            var ground = scene.Sprite('img/ground.png');
            ground.position(74, i * ground_block_size[0]);
            blocks.push(ground);
            ground.update();
        }

        // various transformations
        crazy_mario.position(100, 100);
        crazy_mario.rotate(Math.PI / 2);
        crazy_mario.update();

        ticker = scene.Ticker(paint);
        create_listeners();
        ticker.run();
    });

};



























