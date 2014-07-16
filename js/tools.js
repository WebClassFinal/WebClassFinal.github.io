/**
 * Created by Travis on 2014/7/12.
 */
var init = function() {
    medicine_sound = document.getElementById("soundEfx");

    scene = sjs.Scene({
        w: screen_w,
        h: screen_h
    });

    // load the IMAGES in parallel. When all the IMAGES are
    // ready, the callback function is called.
    scene.loadImages(materials, function() {console.log("map");
        $("<div></div>").attr("id", "startFace").css({
            "position": "absolute",
            "z-index": "10",
            'left': "100px",
            'top': '100px',
            transform: "rotate(90deg)"
        }).prependTo($("body"));
        var startButton = $("<button></botton>").addClass("start").text("开始游戏").css({
            "position": "absolute",
            left: "10px",
            top: "-50px",
            width: "200px"
        });
        var helpButton = $("<button></botton>").addClass("help").text("帮助").css({
            "position": "absolute",
            left: "10px",
            top: "-20px",
            width: "200px"
        });
        startButton.prependTo($("#startFace"));
        helpButton.prependTo($("#startFace"));
        startButton.click(function() {
            $("#startFace").remove();

            ticker = scene.Ticker(paint);console.log("cycle");
            // define the walking movements of mario
            var positions = [];
            for (var i = 0; i < 20; i++) {
                positions.push([i * 21 + 1, 13 + mario_bottom_margin, 5]);
            }
            cycle = scene.Cycle(positions);

            // create mario and set movements
            crazy_mario = scene.Sprite('images/mario_8_bit.png');
            crazy_mario.size(mario_image_size[0], mario_image_size[1] + mario_bottom_margin);
            crazy_mario.scale(mario_width / mario_image_size[0]);
            cycle.addSprite(crazy_mario);
            cycle.update();

            // various transformations
            crazy_mario.position(screen_w, mario_init_y);
            crazy_mario.rotate(Math.PI / 2);
            crazy_mario.update();

            mario_head = scene.Sprite('images/baozou/1.png');
            mario_head.rotate(Math.PI / 2);
            update_mario_head();

            init_map();
            create_listeners();console.log("cycle");
            ticker.run();
        });
    });
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
        if(score < lowestScore){
            end_game();
        }
        restart();
    }

    // update Mario's movements based on collision types;
    mario_movement_classify(crazy_mario, valuable_blocks(crazy_mario, blocks));
    eat_medicine();
};

function decrease_score(){
    score -= deathCost;
}
function end_game(){
    scene.reset();console.log("aaa");
    clearConfig();
    init();
}
function clearConfig(){
    score = initialScore;
    tempScore = score;
    scoreShow = sjs.List();
    medicines = sjs.List();
    blocks = sjs.List();
    medicine_collected = 0;
    rush_flag = false;
    current_progress = 0;
    map_count = 0;
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
    extend_map();
    draw_map();
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
            }
            block.position(j * block_size[1], (i + map_count * map_growth) * block_size[0] - current_progress);
            //            block.scale(block_size[0] / stone_img_size[0]);
            if (1 == type) {
                blocks.add(block);
            } else {
                medicines.add(block);
            }
        }
    }
    map_count++;
};

var draw_map = function() {
    // if map end is nigh, extend the original map
    //    console.log("map length: " + map.length + "; progress: " + current_progress + "; buffer " + map_buffer_size);
    if (map_count * map_growth < current_progress / block_size[0] + map_buffer_size) {
        extend_map();
    }
    update_blocks();
    update_medicines();
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
}

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

function update_scores() {
    if (tempScore != score || scoreShow.list.length == 0) {
        var scoreBase10 = score.toString().split("").map(function(element) {
            return parseInt(element);
        });
        for(var i = 0 ; i < scoreShow.list.length ; i++){
            scoreShow.list[i].remove();
        }
        scoreShow = sjs.List();
        for (var i = 0; i < scoreBase10.length; i++) {
            var scoresImage = scene.Sprite("images/numbers.png");
            var number = scoreBase10[i];
            scoresImage.offset(scoreImageOffset[number].x,scoreImageOffset[number].y);
            scoresImage.size(37, 54);
            scoresImage.rotate(Math.PI / 2);           
            scoresImage.position(screen_w - scoresImage.w - 40, screen_h - scoresImage.h  - i * 40 - 40);

            scoreShow.add(scoresImage);
            scoresImage.update();
        }
        tempScore = score;
    }
}