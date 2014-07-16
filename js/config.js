/**
 * Created by Travis on 2014/7/13.
 */
// objects
var body, crazy_mario, scene, ticker, mario_head;
var blocks = sjs.List();
var medicines = sjs.List();
var scoreShow = sjs.List();
var initialScore = 100;
var score = initialScore;
var tempScore = score;
var scoreImageOffset = [{
    x: 0,
    y: 0
}, {
    x: 37,
    y: 0
}, {
    x: 74,
    y: 0
}, {
    x: 111,
    y: 0
}, {
    x: 148,
    y: 0
}, {
    x: 0,
    y: 54
}, {
    x: 37,
    y: 54
}, {
    x: 74,
    y: 54
}, {
    x: 111,
    y: 54
}, {
    x: 148,
    y: 54
}];
var medicineScore = 10;
var medicine_sound;
var materials = [
    'images/mario_8_bit.png',
    'images/stone.png',
    'images/medicine.png',
    'images/numbers.png',
    'images/baozou/0.png',
    'images/baozou/1.png',
    'images/baozou/2.png',
    'images/baozou/3.png',
    'images/baozou/4.png'
];

// size
var screen_h = screen.height - 4;
var screen_w = screen.width;
var stone_img_size = [21, 21];
var block_size = [21, 21]; // w, h
var mario_image_size = [18, 36];
var mario_width = 21;
var mario_bottom_margin = -1;
var mario_scale = mario_width / mario_image_size[0];
var map_height = Math.floor(screen_w / block_size[1]);
var map_growth = Math.floor(screen_h / block_size[0]);
var map = {
    height: map_height,
    length: 0,
    mapContent: []
};

// speed and distance
var jump_speed = 8;
var global_speed = 3;
var speed_mutation_period = 400000;
var speed_mutation_range = 0.3;
var max_falling_speed = 15;
var factor = 1.1; // step_away / falling speed
var step_away = max_falling_speed * factor;
var gravity = 0.3;
var max_global_speed = 7;
var curr_shift = 0;
var shift_sum = 5;
var shift_span = (max_global_speed - global_speed) / shift_sum;
var map_buffer_size = map_growth;
var border = 5;
var neighbourhood_size = 50;
var mario_init_y = 250;
var head_relative_shift = [12, 3];
var rush_boundary = 80;
var rush_speed_ratio = 1.3;

// time
var rush_flag = false;
var current_progress = 0;
var map_count = 0;

// stats
var medicine_collected = 0;
var medicine_efficacy = 0.7;
