/**
 * Created by Travis on 2014/7/12.
 */
var isRunning = false;
var firstRun = true;

var create_listeners = function () {
    body = $('body');
    body.tap(function () {
//        console.log("body tapped");
//        if (isRunning) {
//            ticker.pause();
//            isRunning = false;
//        } else {
//            if (firstRun) {
//                ticker.run();
//                firstRun = false;
//            } else {
//                ticker.resume();
//            }
//            isRunning = true;
//        }
    });
};

var init = function () {
    var scene = sjs.Scene({w:screen_w, h:screen_h});

    // load the images in parallel. When all the images are
    // ready, the callback function is called.
    scene.loadImages(['img/mario_8_bit.jpg','img/ground.png'], function() {
        var positions = [];
        for (var i = 0; i < 20; i++) {
            positions.push([i * 21, 0, 5]);
        };
        cycle = scene.Cycle(positions);
        // create the Sprite object;
        crazy_mario = scene.Sprite('img/mario_8_bit.jpg');
        crazy_mario.size(21,46);
        cycle.addSprite(crazy_mario);
        cycle.update();

        // create ground
        for (var i = 0; i < screen_h / block_size[0]; i ++) {
            var ground = scene.Sprite('img/ground.png');
            ground.position(74, i * ground_block_size[0]);
            ground.update();
        }


        // change the offset of the image in the sprite
        // (this works the opposite way of a CSS background)
        // sp.offset(50, 50);

        // various transformations
        crazy_mario.position(100, 100);
        crazy_mario.rotate(Math.PI / 2);
        crazy_mario.update();


    });
    ticker = scene.Ticker(paint);

    create_listeners();
};

var paint = function (ticker) {
    cycle.next(5).update();
//    crazy_mario.move(0,3);
    crazy_mario.yv = 3 * Math.sin(ticker.currentTick * Math.PI / 10) + 3;
    crazy_mario.applyYVelocity();
    crazy_mario.update();
}


























