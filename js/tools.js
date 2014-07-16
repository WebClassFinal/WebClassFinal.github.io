/**
 * Created by Travis on 2014/7/12.
 */
var init = function() {
    medicine_sound = document.getElementById("medicine");
    cry_sound = document.getElementById("cry");
//    cry_sound.play();
    bg_sound = document.getElementById("bgsound");
    bg_sound.play();

    scene = sjs.Scene({
        //        autoPause: false
        w: screen_w,
        h: screen_h
    });

    // load the IMAGES in parallel. When all the IMAGES are
    // ready, the callback function is called.
    scene.loadImages(materials, function() {
        $("<div></div>").attr("id", "startFace").css({
            "position": "absolute",
            "z-index": "10",
            width: "100%",
            height: "100%",
            background: "#2EC3E9"


        }).prependTo($("body"));
        var startButton = $("<button></botton>").addClass("start").text("开始游戏").css({
            "position": "absolute",
            left: String(screen_w / 2 - 100) + "px",
            top: String(screen_h / 2 + 50) + "px",
            width: "200px",
            height: "200px",
            transform: "rotate(90deg)",
            background: "radial-gradient(#F867FB, #2EC3E9 100px)",
            border: "none",
            "font-size": "30px"
        });
        var helpButton = $("<button></botton>").addClass("help").text("帮助").css({
            "position": "absolute",
            left: "10px",
            top: "-20px",
            width: "200px"
        });
        startButton.prependTo($("#startFace"));
        /*        helpButton.prependTo($("#startFace"));*/
        $("<img/>").attr("src", "images/start.png").css({
            position: "absolute",
            height: String(screen_w - 30) + "px",
            width: "auto",
            left: "40px",
            transform: "rotate(90deg)",
            "z-index": 40
        }).appendTo($("#startFace"));
        startButton.click(start_game);
        startButton.tap(start_game);
    });
};

var start_game = function() {
    $("#startFace").remove();

    ticker = scene.Ticker(paint);
    // define the walking movements of mario
    var positions = [];
    for (var i = 0; i < 20; i++) {
        positions.push([i * 21 + 1, 13 + mario_bottom_margin, 15]);
    }
    cycle = scene.Cycle(positions);

    // create mario and set movements
    crazy_mario = scene.Sprite('images/mario_8_bit.png');


    init_map();
    crazy_mario.size(mario_image_size[0], mario_image_size[1] + mario_bottom_margin);
    crazy_mario.scale(mario_width / mario_image_size[0]);
    cycle.addSprite(crazy_mario);
    cycle.update();

    // various transformations
    crazy_mario.position(screen_w, mario_init_y);
    crazy_mario.rotate(Math.PI / 2);
    crazy_mario.toFront().update();

    mario_head = scene.Sprite('images/baozou/1.png');
    mario_head.rotate(Math.PI / 2).toFront();



    update_mario_head();



    create_listeners();
    ticker.run();
};

var create_listeners = function() {
    body = $('body');
    body.touchstart(function() {
        jump_collision_classify(crazy_mario, blocks.list);
    });
};

var refresh_map = function() {
    draw_map();
    current_progress += get_current_global_speed();
};
var restart = function() {
    //    debugger;
    crazy_mario.setX(screen_w);
    //    crazy_mario.setY(mario_init_y);
    crazy_mario.xv = 0;
    crazy_mario.yv = 0;
};

var paint = function() {
    cycle.next(5).update();

    // draw other blocks
    refresh_map();

    // return to the top if Mario falls down or goes beyond the border
    if (crazy_mario.x + mario_image_size[1] < 0 || crazy_mario.y < 0) {
        decrease_score();
        if (score <= lowestScore) {
            ticker.pause();
            end_game();
        }
        restart();
    }

    mario_movement_classify(crazy_mario, valuable_blocks(crazy_mario, blocks));

    // update Mario's movements based on collision types;

    update_bee();

    eat_medicine();
};

var update_bee = function () {
//    bee.x = crazy_mario.x;
//    var x = crazy_mario.x + bee_movement_radius * Math.sin(ticker.currentTick / 10);
//    bee.position(Math.min(x, screen_w - bee_image_size[1]), bee_position);
    var x = crazy_mario.x - crazy_mario.xv + bee_movement_radius * Math.sin(ticker.currentTick / 10);
    bee.position(Math.min(x, screen_w - bee_image_size[1]), bee.y);
    if (bee_stun_countdown) {
        bee_stun_countdown --;
        bee.yv = bee_stun_countdown ? bee_yv : 0;
        bee.applyYVelocity();
    }
    bee.applyXVelocity();
    bee.toFront().update();
};

function decrease_score() {
    score = Math.floor(score / deathCostQuotient) - deathCost;
}

function end_game() {

    $("<div></div>").attr("class", "gameEnd").css({
        width: "100%",
        height: "100%"
    }).append($("<p>Game Over</p>").css({
        margin: 0,
        transform: "rotate(90deg)",
        left: String(screen_w / 2 - 160) + "px",
        top: String(screen_h / 2 + 30) + "px",
        position: "absolute",
        "z-index": 50,
        "font-size": "50px",
        height: "100px",
        width: "400px"
    })).prependTo($("body"));
    var d = $("div.gameEnd");
    setTimeout(function() {
        d.removeClass("gameEnd");
        d.addClass("gameEnd2");
    }, 100);
    d.click(function() {
        scene.reset();
        clearConfig();
        $("body  div.sjs").remove();
        $("body div.gameEnd").remove();
        $("body div.gameEnd2").remove();
        d.remove();

        init();
    });

}

function clearConfig() {
    score = initialScore;
    tempScore = score;
    scoreShow = sjs.List();
    medicines = sjs.List();
    blocks = sjs.List();
    medicine_collected = 0;
    rush_flag = false;
    current_progress = 0;
    map_count = 0;
    jump_speed = 8;
    global_speed = 3;
    speed_mutation_period = 400000;
    speed_mutation_range = 0.3;
    max_falling_speed = 15;
    factor = 1.1; // step_away / falling speed
    step_away = max_falling_speed * factor;
    gravity = 0.3;
    max_global_speed = 7;
    curr_shift = 0;
    shift_sum = 5;
    shift_span = (max_global_speed - global_speed) / shift_sum;
    map_buffer_size = map_growth;
    border = 5;
    neighbourhood_size = 50;
    mario_init_y = 250;
    head_relative_shift = [12, 3];
    rush_boundary = 80;
    rush_speed_ratio = 1.3;
    jump_speed = 8;
    global_speed = 3;
    speed_mutation_period = 400000;
    speed_mutation_range = 0.3;
    max_falling_speed = 15;
    factor = 1.1; // step_away / falling speed
    step_away = max_falling_speed * factor;
    gravity = 0.3;
    max_global_speed = 7;
    curr_shift = 0;
    shift_sum = 5;
    shift_span = (max_global_speed - global_speed) / shift_sum;
    map_buffer_size = map_growth;
    border = 5;
    neighbourhood_size = 50;
    mario_init_y = 250;
    head_relative_shift = [12, 3];
    rush_boundary = 80;
    rush_speed_ratio = 1.3;
    screen_h = screen.height - 4;
    screen_w = screen.width;
    stone_img_size = [21, 21];
    block_size = [21, 21]; // w, h
    mario_image_size = [18, 36];
    mario_width = 21;
    mario_bottom_margin = -1;
    mario_scale = mario_width / mario_image_size[0];
    map_height = Math.floor(screen_w / block_size[1]);
    map_growth = Math.floor(screen_h / block_size[0]);
    map = {
        height: map_height,
        length: 0,
        mapContent: []
    };

}
var valuable_blocks = function(crazy_mario, blocks) {
    var vb = [];
    var mx = crazy_mario.x,
        my = crazy_mario.y;
    for (var i = 0; i < blocks.list.length; i++) {
        var b = blocks.list[i];
        if (Math.abs(b.x - mx) > neighbourhood_size || Math.abs(b.y - my) > neighbourhood_size) {
            continue;
        }
        vb.push(b);
    }
    return vb;
};

var get_current_global_speed = function() {
    var s;
    // rush check
    if (crazy_mario.y < rush_boundary) {
        rush_flag = true;
        //        console.log("rush flag to true: " + crazy_mario.y);
        s = max_global_speed;
        mario_rampage();
    } else {
        if (crazy_mario.y < mario_init_y && rush_flag) {
            s = max_global_speed;
        } else {
            if (crazy_mario.y >= mario_init_y) {
                rush_flag = false;
                //                console.log("rush flag to false: " + crazy_mario.y);
            }
            s = Math.max(0, Math.floor(ticker.currentTick / speed_mutation_period) * speed_mutation_range - medicine_collected * medicine_efficacy) + global_speed;
            s = Math.min(s, max_global_speed);
        }
    }
    return s;
};

var get_current_shift = function() {
    var s = Math.floor((get_current_global_speed() - global_speed) / shift_span);
    return Math.min(4, s);
};

// init map
var init_map = function() {
    draw_sky();
    draw_sun();
    draw_bee();
    extend_map();
    draw_map();
    current_progress += get_current_global_speed();
};

var draw_sky = function() {
    sky = scene.Sprite('images/sky.png');
    sky.scale(screen_w, screen_h);
    sky.position(screen_w / 2, screen_h / 2);
    sky.update();
};

var draw_bee = function () {
    bee = scene.Sprite('images/bee.png');
    bee.position(crazy_mario.x, bee_position - bee_stun_countdown * bee_yv).rotate(Math.PI / 2).toFront().update();
};

var draw_sun = function () {
    sun = scene.Sprite('images/sun.png');
    sun.position(sun_x, sun_y).rotate(Math.PI / 2).update();
    sun_original_angle = sun.angle;
};

var extend_map = function() {
    map = generateMap({
        height: map_height,
        length: map_growth
    }, map);

    // add the extended part of the map to the blocks
    for (var i = 0; i < map.length; i++) {
        for (var j = 0; j < map.height; j++) {
            var type = getElementAt(map, j, i);
            if (!type) continue;
            var block;
            if (1 == type) {
                block = scene.Sprite('images/stone.png');
            } else if (2 == type) {
                block = scene.Sprite('images/medicine.png');
                block.rotate(Math.PI / 2);
            }
            block.position(j * block_size[1], (i + map_count * map_growth) * block_size[0] - current_progress);

            if (1 == type) {
                blocks.add(block);
            } else {
                medicines.add(block);
            }
        }
    }
    map_count++;
};

var generate_clouds = function(height, length) {
    for (var i = 0; i < Math.random() * 3 + 3; i++) {
        var cloud = scene.Sprite('images/cloud.png');
        var y = length * block_size[0] + Math.random() * length * block_size[0];
        var x = (height - Math.random() * 4 - 2) * block_size[1];
        cloud.position(x, y);
        cloud.rotate(Math.PI / 2).update();
        clouds.add(cloud);
    }
};

var draw_map = function() {
    // if map end is nigh, extend the original map
    //    console.log("map length: " + map.length + "; progress: " + current_progress + "; buffer " + map_buffer_size);
    if (map_count * map_growth < current_progress / block_size[0] + map_buffer_size) {
        extend_map();
    }

    if (clouds.length == 0 || clouds.list[clouds.length - 1].y < screen_h / 2) {
        generate_clouds(map_height, map_growth);
    }
    update_blocks();
    update_medicines();
    update_sun();
    update_clouds();
    update_scores();

    //    console.log(blocks.length + ": " + medicines.length);
};

var update_medicines = function() {
    // update blocks' position
    for (var i = 0; i < medicines.length; i++) {
        var obj = medicines.list[i];
        // if block goes beyond the map, eliminate it
        if (obj.y < -block_size[1]) {
            obj.remove();
            medicines.remove(obj);
            i--;
        } else {
            obj.yv = -get_current_global_speed();
            obj.applyYVelocity();
            obj.update();
        }
    }
};

var update_clouds = function() {
    for (var i = 0; i < clouds.length; i++) {
        var obj = clouds.list[i];
        // if block goes beyond the map, eliminate it
        if (obj.y < -cloud_image_size[0]) {
            obj.remove();
            clouds.remove(obj);
            i--;
        } else {
            obj.yv = -get_current_global_speed();
            obj.applyYVelocity();
            obj.update();
        }
    }
};

var update_blocks = function() {

    // update blocks' position
    for (var i = 0; i < blocks.length; i++) {
        var obj = blocks.list[i];
        // if block goes beyond the map, eliminate it
        if (obj.y < -block_size[1]) {
            obj.remove();
            blocks.remove(obj);
            i--;
        } else {
            obj.yv = -get_current_global_speed();
            obj.applyYVelocity();
            obj.update();
        }
    }
};

var update_sun = function () {
    if (rush_flag) {
        sun.rotate(head_rotation_angular_speed * (get_current_shift() + 1) * head_rotation_direction);
    } else {
        if (sun.angle != sun_original_angle) {
            sun.rotate(-sun.angle +sun_original_angle);
        }
    }
    sun.position(sun_x, sun_y + 5 * Math.cos(ticker.currentTick / 20)).update();
};

function update_scores() {
    if (tempScore != score || scoreShow.list.length == 0) {
        var scoreBase10 = score.toString().split("").map(function(element) {
            return parseInt(element);
        });
        var preScoreBase10 = tempScore.toString().split("").map(function(element) {
            return parseInt(element);
        });

        var newScoreShow = sjs.List();

        for (var i = 0; i < scoreBase10.length; i++) {
            var scoresImage = scene.Sprite("images/numbers.png");
            var number = scoreBase10[i];
            scoresImage.offset(scoreImageOffset[number].x, scoreImageOffset[number].y);
            var xsize = 37;
            scoresImage.size(xsize, 54);
            scoresImage.rotate(Math.PI / 2);
            scoresImage.position(screen_w - scoresImage.h * 2, screen_h - scoresImage.w + i * 40 - 40 * scoreBase10.length);

            newScoreShow.add(scoresImage);
            scoresImage.update();

        }
        for (var i = 0; i < scoreShow.list.length; i++) {
            scoreShow.list[i].remove();
        }
        scoreShow = newScoreShow;
        tempScore = score;
    }
}
